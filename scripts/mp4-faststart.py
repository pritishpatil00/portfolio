#!/usr/bin/env python3
"""Rewrite an MP4 so the moov atom sits before mdat (fast start)."""

from __future__ import annotations

import struct
import sys
from pathlib import Path

CONTAINERS = {
    b'moov', b'trak', b'mdia', b'minf', b'stbl',
    b'edts', b'dinf', b'udta', b'mvex',
}


def iter_atoms(buf: memoryview | bytes, start: int, end: int):
    i = start
    while i + 8 <= end:
        size = struct.unpack_from('>I', buf, i)[0]
        typ = bytes(buf[i + 4:i + 8])
        hdr = 8
        if size == 1:
            if i + 16 > end:
                break
            size = struct.unpack_from('>Q', buf, i + 8)[0]
            hdr = 16
        elif size == 0:
            size = end - i
        if size < hdr or i + size > end:
            break
        yield i, size, hdr, typ
        i += size


def patch_chunk_offsets(moov: bytearray, delta: int) -> None:
    def walk(start: int, end: int) -> None:
        for i, size, hdr, typ in iter_atoms(moov, start, end):
            body = i + hdr
            atom_end = i + size
            if typ in (b'stco', b'co64'):
                count = struct.unpack_from('>I', moov, body + 4)[0]
                ptr = body + 8
                if typ == b'stco':
                    for _ in range(count):
                        val = struct.unpack_from('>I', moov, ptr)[0] + delta
                        struct.pack_into('>I', moov, ptr, val)
                        ptr += 4
                else:
                    for _ in range(count):
                        val = struct.unpack_from('>Q', moov, ptr)[0] + delta
                        struct.pack_into('>Q', moov, ptr, val)
                        ptr += 8
            elif typ in CONTAINERS:
                walk(body, atom_end)

    walk(8, len(moov))


def faststart(path: Path) -> bool:
    data = bytearray(path.read_bytes())
    atoms = list(iter_atoms(data, 0, len(data)))
    types = [typ.decode('latin1') for _, _, _, typ in atoms]
    moov = next(((i, size) for i, size, _, typ in atoms if typ == b'moov'), None)
    mdat = next(((i, size) for i, size, _, typ in atoms if typ == b'mdat'), None)
    ftyp = next(((i, size) for i, size, _, typ in atoms if typ == b'ftyp'), None)
    if not moov or not mdat or not ftyp:
        print(f'skip {path.name}: missing ftyp/moov/mdat ({types})')
        return False
    if moov[0] < mdat[0]:
        print(f'ok   {path.name}: already faststart')
        return False

    ftyp_slice = bytes(data[ftyp[0]:ftyp[0] + ftyp[1]])
    moov_buf = bytearray(data[moov[0]:moov[0] + moov[1]])
    rest = bytearray()
    for i, size, _, typ in atoms:
        if typ in (b'ftyp', b'moov'):
            continue
        rest.extend(data[i:i + size])

    patch_chunk_offsets(moov_buf, len(moov_buf))
    out = ftyp_slice + bytes(moov_buf) + bytes(rest)
    tmp = path.with_suffix(path.suffix + '.faststart')
    tmp.write_bytes(out)
    tmp.replace(path)
    print(f'fix  {path.name}: moov moved before mdat ({path.stat().st_size} bytes)')
    return True


def main() -> None:
    root = Path(__file__).resolve().parents[1] / 'public' / 'videos'
    files = [Path(a) for a in sys.argv[1:]] or sorted(root.glob('*.mp4'))
    for path in files:
        faststart(path)


if __name__ == '__main__':
    main()

export default function AllAthleteLayout({ children }) {
  return (
    <>
      <link rel="preload" href="/videos/allathlete.mp4" as="video" type="video/mp4" />
      {children}
    </>
  )
}

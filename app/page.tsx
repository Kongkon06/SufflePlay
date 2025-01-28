import Appbar from "./components/Appbar";

export default function Home() {
  console.log(process.env.GOOGLE_CLIENT_ID);
  return <main>
    <Appbar/>

  </main>
}

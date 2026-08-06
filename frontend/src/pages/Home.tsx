import { useEffect } from "react";
console.log("Home render");
const Home = () => {
  useEffect( () => {
      
      fetch("http://localhost:3000/home", {
          credentials: "include",
      })
      .then(async res => {
          console.log("Status:", res.status);

          const text = await res.text();
          console.log(text);
      });
  }, []);
  return (
    <div>Home</div>
  )
}

export default Home
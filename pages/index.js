import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

// posts will be populated at build time by getStaticProps()
function Home({ data }) {
  const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const month = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  const d = new Date();
  return (
    <div>
      <>{weekday[d.getDay()]}</>
      <>{d.getDate() + ". " + month[d.getMonth()]}</>
      <table>
        <tbody>
          {data[0].map((item) => (
            <tr>
              <th>{item.Date.substring(15, 21)}</th>
              <th>{item.item_name}</th>
              <th>{item.amount}</th>
              <th>{item.calories}</th>
              <th>{item.carbs}</th>
              <th>{item.fat}</th>
              <th>{item.proteins}</th>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total Calories: {data[1]._sum.calories}</h3>

      <form onSubmit={async e => { submitItem() }} method="post">
        <label for="item_name">Name:</label>
        <input type="text" name="item_name" id="item_name" />
        <label for="name">Amount:</label>
        <input type="text" name="amount" id="amount" />
        <label for="name">Calories:</label>
        <input type="text" name="calories" id="calories" />
        <label for="name">Carbs:</label>
        <input type="text" name="carbs" id="carbs" />
        <label for="name">Fat:</label>
        <input type="text" name="fat" id="fat" />
        <label for="name">Proteins:</label>
        <input type="text" name="proteins" id="proteins" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export async function getServerSideProps() {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const today_end = new Date()
  today_end.setUTCHours(23, 59, 59, 999)
  const url = 'http://localhost:3000/api/load_day_items?date=' + today.toISOString() + '&date_end=' + today_end.toISOString()
  console.log(url)
  // Fetch data from external API
  const res = await fetch(url)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export async function submitItem() {
  const item_name = document.getElementById("item_name").value;
  const amount = document.getElementById("amount").value;
  const calories = document.getElementById("calories").value;
  const carbs = document.getElementById("carbs").value;
  const fat = document.getElementById("fat").value;
  const proteins = document.getElementById("proteins").value;
  const date = new Date();

  const res = await fetch(`http://localhost:3000/api/create_item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      item_name,
      amount,
      calories,
      carbs,
      fat,
      proteins,
      date,
    })
  })
  const data = await res.json()
}

export default Home

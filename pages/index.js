import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

// posts will be populated at build time by getStaticProps()
function Home({ data }) {
  const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const month = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  const d = new Date();
  return (
    <div className={styles.container} id="container">
      <div className={styles.date}>{weekday[d.getDay()]}, {d.getDate() + ". " + month[d.getMonth()]}</div>
      <table className={styles.day_item_table}>
        <tbody>
          <tr className={styles.topRow}>
            <th>Uhrzeit</th>
            <th>Name</th>
            <th>Menge</th>
            <th>Kalorien</th>
            <th>Proteine</th>
            <th>Fett</th>
            <th>Kohlenhydrate</th>
          </tr>
          {data[0].map((item) => (
            <tr>
              <th>{item.Date.substring(15, 21)}</th>
              <th>{item.food.item_name}</th>
              <th>{item.amount}</th>
              <th>{item.food.calories * item.amount}</th>
              <th>{item.food.proteins * item.amount}</th>
              <th>{item.food.carbs * item.amount}</th>
              <th>{item.food.fat * item.amount}</th>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <th>Total</th>
            <th></th>
            <th></th>
            <th>{data[1][0]}</th>
            <th>{data[1][1]}</th>
            <th>{data[1][2]}</th>
            <th>{data[1][3]}</th>
          </tr>
        </tbody>
      </table>

      <h3>
        Total Calories: {data[1][0]}
        Total Proteins: {data[1][1]}
        Total Carbs: {data[1][2]}
        Total Fat: {data[1][3]}
      </h3>


      Create New Food Item:
      <form onSubmit={async e => { createNewItem() }} method="post">
        <label for="item_name">Name:</label>
        <input type="text" name="item_name" id="item_name" />
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

      Add Item to List:
      <form onSubmit={async e => { addItemToDay() }} method="post">
        <select id="items" name="items">
          {data[2].map((item) => (<option value={item.item_id}>{item.item_name}</option>))}
        </select>
        <label for="name">Amount:</label>
        <input type="text" name="amount" id="amount" />
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
  const url = 'http://localhost:3000/api/load_data?date=' + today.toISOString() + '&date_end=' + today_end.toISOString()
  // Fetch data from external API
  const res = await fetch(url)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export async function createNewItem() {
  const item_name = document.getElementById("item_name").value;
  const calories = document.getElementById("calories").value;
  const carbs = document.getElementById("carbs").value;
  const fat = document.getElementById("fat").value;
  const proteins = document.getElementById("proteins").value;

  const res = await fetch(`http://localhost:3000/api/create_item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      item_name,
      calories,
      carbs,
      fat,
      proteins,
    })
  })
  const data = await res.json()
}

export async function addItemToDay() {
  const item_id = document.getElementById("items").value;
  const amount = document.getElementById("amount").value;
  const date = new Date();

  const res = await fetch(`http://localhost:3000/api/add_item_to_day`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      item_id,
      amount,
      date,
    })
  })
  const data = await res.json()
}

export default Home

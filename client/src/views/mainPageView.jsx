import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/authContext'

const MainPageView = () => {
  const { user, logout } = useAuth()

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Workflow</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>Hi, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <main style={styles.main}>
        <h2>Your goals</h2>
        <p style={{ color: '#666' }}>Goals</p>
      </main>
    </div>
  )
}

const styles = {
  container: {},
  nav: {},
  logo: {},
  navRight: {},
  userName: {},
  logoutBtn: {},
  main: {},
}

export default MainPageView
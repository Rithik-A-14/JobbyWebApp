import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => {
  const userJwtToken = Cookies.get('jwt_token')
  if (userJwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-page-container">
        <h1 className="home-page-main-heading">
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p className="home-page-description">
          Millions of people are searching for jobs, salary <br />
          information, company reviews. Find the job that fits your <br />
          abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="find-jobs-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home

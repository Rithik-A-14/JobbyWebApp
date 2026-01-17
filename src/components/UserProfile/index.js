import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {profileInfo: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.fetchProfile()
  }

  fetchProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const userJwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${userJwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileInfo: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileRetryView = () => (
    <div className="retry-card">
      <button type="button" className="retry-btn" onClick={this.fetchProfile}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileInfo} = this.state

    return (
      <div className="profile-card">
        <img
          src={profileInfo.profileImageUrl}
          alt="profile"
          className="profile-img"
        />
        <h1 className="profile-name">{profileInfo.name}</h1>
        <p className="profile-bio">{profileInfo.shortBio}</p>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileRetryView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default UserProfile

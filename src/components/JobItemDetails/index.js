import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {RiExternalLinkLine} from 'react-icons/ri'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetail: {},
    apiStatus: apiStatusConstants.initial,
    jobSkills: [],
    similarJobs: [],
    lifeAtCompany: {},
  }

  componentDidMount() {
    this.fetchJob()
  }

  fetchJob = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const userJwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${userJwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedJobDetail = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        jobDescription: fetchedData.job_details.job_description,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        title: fetchedData.job_details.title,
      }
      const updatedJobSkills = fetchedData.job_details.skills.map(skill => ({
        imageUrl: skill.image_url,
        name: skill.name,
      }))
      const updatedSimilarJobs = fetchedData.similar_jobs.map(similar => ({
        companyLogoUrl: similar.company_logo_url,
        employmentType: similar.employment_type,
        id: similar.id,
        jobDescription: similar.job_description,
        location: similar.location,
        rating: similar.rating,
        title: similar.title,
      }))
      const lifeAtCompany = {
        description: fetchedData.job_details.life_at_company.description,
        imageUrl: fetchedData.job_details.life_at_company.image_url,
      }

      this.setState({
        jobDetail: updatedJobDetail,
        similarJobs: updatedSimilarJobs,
        jobSkills: updatedJobSkills,
        lifeAtCompany,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderFailureView = () => (
    <div className="job-details-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-details-failure-img"
      />
      <h1 className="job-details-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="job-details-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.fetchJob}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetailView = () => {
    const {jobDetail, jobSkills, lifeAtCompany, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetail

    return (
      <>
        <Header />
        <div className="job-details-page-container">
          <div className="job-detail-card">
            <div className="company-logo-title-card">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="company-title-rating-card">
                <h1 className="job-title">{title}</h1>
                <div className="rating-container">
                  <FaStar className="star" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>

            <div className="job-location-employment-package">
              <div className="location-card">
                <MdLocationOn className="location-employment-icon" />
                <p className="job-location">{location}</p>
              </div>
              <div className="employment-type-card">
                <BsBriefcaseFill className="location-employment-icon" />
                <p className="job-employment-type">{employmentType}</p>
              </div>
              <p className="job-package">{packagePerAnnum}</p>
            </div>
            <div className="job-company-details">
              <div className="job-description-title-card">
                <h1 className="job-description-heading">Description</h1>
                <a
                  className="visit-company-link"
                  href={companyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit <RiExternalLinkLine />
                </a>
              </div>
              <p className="job-description">{jobDescription}</p>
            </div>
            <h1 className="job-description-heading">Skills</h1>
            <ul className="job-skills-list">
              {jobSkills.map(eachSkill => (
                <li className="skill-item" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skill-image"
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="job-description-heading">Life at Company</h1>
            <div className="life-at-company-card">
              <p className="life-at-company-description">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
          <h1 className="job-description-heading">Similar Jobs</h1>
          <ul className="job-skills-list">
            {similarJobs.map(eachJob => (
              <li className="similar-job-item" key={eachJob.id}>
                <div className="company-logo-title-card">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo"
                  />
                  <div className="company-title-rating-card">
                    <h1 className="job-title">{eachJob.title}</h1>
                    <div className="rating-container">
                      <FaStar className="star" />
                      <p className="rating">{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="job-company-details">
                  <h1 className="job-description-heading">Description</h1>
                  <p className="job-description">{eachJob.jobDescription}</p>
                </div>
                <div className="similar-job-location-employment">
                  <div className="location-card">
                    <MdLocationOn className="location-employment-icon" />
                    <p className="job-location">{eachJob.location}</p>
                  </div>
                  <div className="employment-type-card">
                    <BsBriefcaseFill className="location-employment-icon" />
                    <p className="job-employment-type">
                      {eachJob.employmentType}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default JobItemDetails

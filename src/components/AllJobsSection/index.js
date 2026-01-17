import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import UserProfile from '../UserProfile'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobsSection extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    activeEmploymentTypeIds: [], // Changed to array
    activeMinimumPackage: '',
    searchInputValue: '',
  }

  componentDidMount() {
    this.fetchJobs()
  }

  fetchJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const userJwtToken = Cookies.get('jwt_token')
    const {
      activeEmploymentTypeIds,
      activeMinimumPackage,
      searchInputValue,
    } = this.state

    // Join employment types with comma for API
    const employmentTypeParam = activeEmploymentTypeIds.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeParam}&minimum_package=${activeMinimumPackage}&search=${searchInputValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${userJwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  // Modified to handle multiple selections
  changeEmploymentTypeSelection = employmentTypeId => {
    this.setState(
      prevState => {
        const {activeEmploymentTypeIds} = prevState
        if (activeEmploymentTypeIds.includes(employmentTypeId)) {
          // Remove if already selected
          return {
            activeEmploymentTypeIds: activeEmploymentTypeIds.filter(
              id => id !== employmentTypeId,
            ),
          }
        }
        // Add if not selected
        return {
          activeEmploymentTypeIds: [
            ...activeEmploymentTypeIds,
            employmentTypeId,
          ],
        }
      },
      this.fetchJobs, // Call fetchJobs after state update
    )
  }

  changeMinimumPackageSelection = activeMinimumPackage => {
    this.setState({activeMinimumPackage}, this.fetchJobs)
  }

  triggerSearch = () => {
    this.fetchJobs()
  }

  handleSearchInputChange = event => {
    this.setState({searchInputValue: event.target.value})
  }

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      this.triggerSearch()
    }
  }

  renderSearchInput = searchContainerClass => {
    const {searchInputValue} = this.state
    return (
      <div className={`search-input-container ${searchContainerClass}`}>
        <input
          value={searchInputValue}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.handleSearchInputChange}
          onKeyDown={this.handleKeyDown}
        />
        <button
          type="button"
          className="search-icon-container"
          onClick={this.triggerSearch}
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.fetchJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0

    return shouldShowJobsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      activeEmploymentTypeIds,
      activeMinimumPackage,
      searchInputValue,
    } = this.state

    return (
      <div className="all-jobs-section">
        <div className="jobs-sidebar">
          {this.renderSearchInput('search-mobile')}
          <UserProfile />
          <FiltersGroup
            searchInputValue={searchInputValue}
            handleSearchInputChange={this.handleSearchInputChange}
            triggerSearch={this.triggerSearch}
            activeEmploymentTypeIds={activeEmploymentTypeIds}
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            activeMinimumPackage={activeMinimumPackage}
            changeEmploymentTypeSelection={this.changeEmploymentTypeSelection}
            changeMinimumPackageSelection={this.changeMinimumPackageSelection}
          />
        </div>
        <div className="main-content-area">
          {this.renderSearchInput('search-desktop')}
          {this.renderAllJobs()}
        </div>
      </div>
    )
  }
}

export default AllJobsSection

import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="job-item-link">
      <li className="job-item">
        <div className="company-logo-title-card">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <div className="job-details">
          <h1 className="job-description-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobCard

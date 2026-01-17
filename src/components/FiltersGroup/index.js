import './index.css'

const FiltersGroup = props => {
  const renderSalaryRangesList = () => {
    const {salaryRangesList} = props
    const {changeMinimumPackageSelection, activeMinimumPackage} = props

    return salaryRangesList.map(salary => {
      const handleMinimumPackageChange = () =>
        changeMinimumPackageSelection(salary.salaryRangeId)

      return (
        <li
          className="salary-range-item"
          key={salary.salaryRangeId}
          onClick={handleMinimumPackageChange}
        >
          <input
            type="radio"
            name="salary-range"
            checked={activeMinimumPackage === salary.salaryRangeId}
            onChange={handleMinimumPackageChange}
            id={salary.salaryRangeId}
          />
          <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
        </li>
      )
    })
  }

  const renderSalaryRanges = () => (
    <div>
      <h1 className="salary-ranges-heading">Salary Range</h1>
      <ul className="salary-ranges-list">{renderSalaryRangesList()}</ul>
    </div>
  )

  const renderEmploymentTypesList = () => {
    const {employmentTypesList} = props
    const {activeEmploymentTypeIds = [], changeEmploymentTypeSelection} = props

    return employmentTypesList.map(eachType => {
      const isActive = activeEmploymentTypeIds.includes(
        eachType.employmentTypeId,
      )

      const handleEmploymentTypeChange = () => {
        changeEmploymentTypeSelection(eachType.employmentTypeId)
      }

      return (
        <li className="employment-type-item" key={eachType.employmentTypeId}>
          <input
            type="checkbox"
            checked={isActive}
            id={eachType.employmentTypeId}
            onChange={handleEmploymentTypeChange}
          />
          <label
            htmlFor={eachType.employmentTypeId}
            className="employment-type-name"
          >
            {eachType.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentTypes = () => (
    <>
      <h1 className="employment-types-heading">Type of Employment</h1>
      <ul className="employment-types-list">{renderEmploymentTypesList()}</ul>
    </>
  )

  return (
    <div className="filters-group-container">
      {renderEmploymentTypes()}
      {renderSalaryRanges()}
    </div>
  )
}

export default FiltersGroup

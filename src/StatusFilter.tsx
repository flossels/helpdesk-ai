import type { FilterValue } from './types.ts'

type Props = {
  value: FilterValue
  onChange: (value: FilterValue) => void
}

export function StatusFilter({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="status-filter">Filter by status:{' '}</label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) =>
          onChange(e.target.value as FilterValue)
        }
      >
        <option value="ALL">All</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="WAITING">Waiting</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  )
}
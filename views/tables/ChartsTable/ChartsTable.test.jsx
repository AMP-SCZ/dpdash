import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import moment from 'moment'

import ChartsTable, { DATE_FORMAT } from '.'
import { createChart, createUser } from '../../../test/fixtures'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { routes } from '../../routes/routes'

describe(ChartsTable, () => {
  const user = createUser({ uid: 'user' })
  const charts = [
    createChart({
      title: 'first chart',
      updatedAt: '2023-06-28T15:43:23.789Z',
      owner: user.uid,
    }),
    createChart({
      title: 'second chart',
      updatedAt: '2022-11-10T00:01:04.713Z',
      owner: 'foo',
    }),
    createChart({
      title: 'third chart',
      updatedAt: '2022-10-11T16:33:46.485Z',
      owner: 'bar',
    }),
  ]
  const defaultProps = {
    charts,
    onDelete: () => {},
    onDuplicate: () => {},
    onShare: () => {},
    user,
  }
  const renderChart = (props = defaultProps) =>
    render(
      <MemoryRouter>
        <ChartsTable {...props} />
      </MemoryRouter>
    )
  const elements = {
    editLink: () => screen.getByTestId('edit'),
    deleteBtn: () => screen.getByText('Delete'),
    duplicateBtn: () => screen.getByText('Duplicate'),
    shareBtn: () => screen.getByText('Share'),
    tableRow: (tableRow) => screen.getByTestId(`row-${tableRow}`),
  }
  const actions = {
    openTableRowMenu: async (tableRow) => {
      return await userEvent.click(
        screen.getByRole('button', {
          name: `open menu for ${charts[tableRow].title}`,
        })
      )
    },
    deleteChart: async (tableRow) => {
      await actions.openTableRowMenu(tableRow)
      await userEvent.click(elements.deleteBtn())
    },
    duplicateChart: async (tableRow) => {
      await actions.openTableRowMenu(tableRow)
      await userEvent.click(elements.duplicateBtn())
    },
    shareChart: async (tableRow) => {
      await actions.openTableRowMenu(tableRow)
      await userEvent.click(elements.shareBtn())
    },
  }

  it('renders charts', () => {
    renderChart()

    expect(
      within(elements.tableRow(0)).getByText(charts[0].title)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(0)).getByText(charts[0].owner)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(0)).getByText(
        moment(charts[0].updatedAt).format(DATE_FORMAT)
      )
    ).toBeInTheDocument()

    expect(
      within(elements.tableRow(1)).getByText(charts[1].title)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(1)).getByText(charts[1].owner)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(1)).getByText(
        moment(charts[1].updatedAt).format(DATE_FORMAT)
      )
    ).toBeInTheDocument()

    expect(
      within(elements.tableRow(2)).getByText(charts[2].title)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(2)).getByText(charts[2].owner)
    ).toBeInTheDocument()
    expect(
      within(elements.tableRow(2)).getByText(
        moment(charts[2].updatedAt).format(DATE_FORMAT)
      )
    ).toBeInTheDocument()
  })

  it('renders a menu of chart actions', async () => {
    renderChart()

    await actions.openTableRowMenu(1)

    expect(elements.editLink()).toHaveAttribute(
      'href',
      routes.editChart(charts[1]._id)
    )
    expect(elements.deleteBtn()).toBeInTheDocument()
    expect(elements.duplicateBtn()).toBeInTheDocument()
    expect(elements.shareBtn()).toBeInTheDocument()
  })

  describe('when the user is the chart owner', () => {
    it('calls the onDelete prop when "delete" is clicked', async () => {
      const props = { ...defaultProps, onDelete: jest.fn() }

      renderChart(props)
      await actions.deleteChart(0)

      expect(props.onDelete).toHaveBeenCalledWith(charts[0])
    })

    it('calls the onDuplicate prop when "duplicate" is clicked', async () => {
      const props = { ...defaultProps, onDuplicate: jest.fn() }

      renderChart(props)
      await actions.duplicateChart(0)

      expect(props.onDuplicate).toHaveBeenCalledWith(charts[0])
    })

    it('calls the onShare prop when "share" is clicked', async () => {
      const props = { ...defaultProps, onShare: jest.fn() }

      renderChart(props)
      await actions.shareChart(0)

      expect(props.onShare).toHaveBeenCalledWith(charts[0])
    })
  })

  describe('when the user is not the chart owner', () => {
    it('does not call the onDelete prop when "delete" is clicked', async () => {
      expect.assertions(1)
      const props = { ...defaultProps, onDelete: jest.fn() }

      renderChart(props)

      try {
        await actions.deleteChart(1)
      } catch {
        expect(props.onDelete).not.toHaveBeenCalled()
      }
    })

    it('calls the onDuplicate prop when "duplicate" is clicked', async () => {
      const props = { ...defaultProps, onDuplicate: jest.fn() }

      renderChart(props)
      await actions.duplicateChart(1)

      expect(props.onDuplicate).toHaveBeenCalledWith(charts[1])
    })

    it('calls the onShare prop when "share" is clicked', async () => {
      const props = { ...defaultProps, onShare: jest.fn() }

      renderChart(props)
      await actions.shareChart(1)

      expect(props.onShare).toHaveBeenCalledWith(charts[1])
    })
  })
})

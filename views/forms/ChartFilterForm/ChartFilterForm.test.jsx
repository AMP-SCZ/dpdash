import React from 'react'

import {
  render,
  screen,
  waitFor,
  fireEvent,
  queryByAttribute,
} from '@testing-library/react'

import ChartFilterForm from '.'

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useWatch: ({ name }) => {
    if (name === 'chrcrit_part')
      return {
        HC: { label: 'HC', value: 0 },
        CHR: { label: 'CHR', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      }

    if (name === 'included_excluded')
      return {
        Included: { label: 'Included', value: 0 },
        Excluded: { label: 'Excluded', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      }
    if (name === 'sex_at_birth')
      return {
        Male: { label: 'Male', value: 0 },
        Female: { label: 'Female', value: 0 },
        Missing: { label: 'Missing', value: 0 },
      }

    if (name === 'sites')
      return {
        CA: { label: 'CA', value: 1 },
        LA: { label: 'LA', value: 1 },
        MA: { label: 'MA', value: 0 },
      }

    if (name === 'networks')
      return {
        PRESCIENT: { label: 'PRESCIENT', value: 1 },
        ProNET: { label: 'ProNET', value: 0 },
      }
  },
}))

describe('Chart Filter Form', () => {
  const defaultInitialValues = {
    chrcrit_part: {
      HC: { label: 'HC', value: 0 },
      CHR: { label: 'CHR', value: 0 },
      Missing: { label: 'Missing', value: 0 },
    },
    included_excluded: {
      Included: { label: 'Included', value: 0 },
      Excluded: { label: 'Excluded', value: 0 },
      Missing: { label: 'Missing', value: 0 },
    },
    sex_at_birth: {
      Male: { label: 'Male', value: 0 },
      Female: { label: 'Female', value: 0 },
      Missing: { label: 'Missing', value: 0 },
    },
    sites: {
      CA: { label: 'CA', value: 1 },
      LA: { label: 'LA', value: 1 },
      MA: { label: 'MA', value: 0 },
      ME: { label: 'ME', value: 0 },
    },
    networks: {
      PRESCIENT: { label: 'PRESCIENT', value: 0 },
      ProNET: { label: 'ProNET', value: 0 },
    },
  }

  const defaultProps = {
    initialValues: defaultInitialValues,
    onSubmit: () => {},
  }

  const getById = queryByAttribute.bind(null, 'id')
  const elements = {
    form: () => screen.getByTestId('filter_form'),
    clearButton: () => screen.getByRole('button', { name: 'Clear' }),
    sitesCombobox: () => screen.getByRole('combobox', { name: 'Sites' }),
    prescientSiteOption: () => screen.getByTestId('menu_item_option_ME'),
    pronetSiteOption: () => screen.queryByTestId('menu_item_option_LA'),
  }

  const renderForm = (props = defaultProps) => {
    return render(<ChartFilterForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    const { container } = renderForm(props)

    await fireEvent.change(getById(container, 'select-multiple-chrcrit_part'), {
      target: { value: 'HC' },
    })
    await fireEvent.change(
      getById(container, 'select-multiple-included_excluded'),
      { target: { value: 'Missing' } }
    )
    await fireEvent.change(getById(container, 'select-multiple-sites'), {
      target: { value: 'MA' },
    })
    fireEvent.submit(elements.form())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          chrcrit_part: {
            HC: { label: 'HC', value: 1 },
            CHR: { label: 'CHR', value: 0 },
            Missing: { label: 'Missing', value: 0 },
          },
          included_excluded: {
            Included: { label: 'Included', value: 0 },
            Excluded: { label: 'Excluded', value: 0 },
            Missing: { label: 'Missing', value: 1 },
          },
          sex_at_birth: {
            Male: { label: 'Male', value: 0 },
            Female: { label: 'Female', value: 0 },
            Missing: { label: 'Missing', value: 0 },
          },
          sites: {
            CA: { label: 'CA', value: 0 },
            LA: { label: 'LA', value: 0 },
            MA: { label: 'MA', value: 1 },
            ME: { label: 'ME', value: 0 },
          },
          networks: {
            PRESCIENT: { label: 'PRESCIENT', value: 0 },
            ProNET: { label: 'ProNET', value: 0 },
          },
        },
        expect.anything()
      )
    )
  })

  test('updates the available sites when a network is selected', async () => {
    const props = {
      ...defaultProps,
      initialValues: {
        ...defaultInitialValues,
        sites: {
          CA: { label: 'CA', value: 1 },
          LA: { label: 'LA', value: 1 },
          MA: { label: 'MA', value: 1 },
          ME: { label: 'ME', value: 1 },
        },
      },
    }

    const { container } = renderForm(props)

    await fireEvent.change(getById(container, 'select-multiple-networks'), {
      target: { value: 'PRESCIENT' },
    })
    await userEvent.click(elements.sitesCombobox())
    await waitFor(() => {
      expect(elements.clearButton()).toBeInTheDocument()
    })
    expect(elements.prescientSiteOption()).toBeInTheDocument()
    expect(elements.pronetSiteOption()).toBe(null)
  })
})

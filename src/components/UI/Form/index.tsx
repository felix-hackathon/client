import { FormProvider } from 'react-hook-form'
import { styled } from 'styled-components'

export interface IForm {
  form: any
  children: React.ReactNode
  autoComplete?: string
  onSubmit?: (value: any) => any
  onError?: (error: any) => any
}

const CustomForm = styled.form`
  width: 100%;
`

const Form = (props: IForm) => {
  const {
    form,
    children,
    onSubmit = () => {},
    onError = () => {},
    autoComplete,
    ...rest
  } = props

  return (
    <FormProvider {...form}>
      <CustomForm
        onSubmit={form.handleSubmit(onSubmit, onError)}
        autoComplete={autoComplete}
        {...rest}>
        {children}
        <input
          type='submit'
          hidden
        />
      </CustomForm>
    </FormProvider>
  )
}

export default Form

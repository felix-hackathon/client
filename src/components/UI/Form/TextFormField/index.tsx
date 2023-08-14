import Image from 'next/image'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { css, keyframes, styled } from 'styled-components'
import hidePassword from '@/assets/icons/hide-password.svg'
import showPassword from '@/assets/icons/show-password.svg'

const Container = styled.div<any>`
  width: ${(props) => props.width};
`

const shake = keyframes`
   10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`

const Wrapper = styled.div<any>`
  margin-top: 20px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 60px;
  border: 1px solid #727e96;
  border-radius: 10px;
  padding: 5px 15px;
  ${(props) =>
    props.$invalid &&
    css`
      animation: ${shake} 0.3s;
      animation-iteration-count: initial;
      border-color: #ff2424;
    `}
`

const CustomInput = styled.input`
  width: ${(props) => props.width};
  height: 70%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: #333;
  &::placeholder {
    color: transparent;
  }

  &:not(:placeholder-shown) + label,
  &:focus + label {
    background-color: transparent;
    transition: 0.5s;
    transform: translateY(-45px) translateX(-10px);
  }
  &[type='password'] {
    font-family: caption;
    color: #333;
    letter-spacing: 3px;
  }
`

const Label = styled.label<any>`
  position: absolute;
  font-weight: 400;
  color: #727e96;
  pointer-events: none;
  ${(props) =>
    props.$invalid &&
    css`
      color: #ff2424;
    `}
`

const Error = styled.span`
  position: absolute;
  transform: translate(-15px, 40px);
  font-size: 14px;
  color: #ff2424;
`

const PasswordIcon = styled(Image)`
  position: absolute;
  cursor: pointer;
  align-self: flex-end;
`

export type InputProps = {
  width?: string
  label?: string
  error?: string | string[] | any
  type?: 'text' | 'password'
  $showError?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Input = React.forwardRef((props: InputProps, ref: any) => {
  const { className = '', error, type = 'text', label, width = '100%', $showError = true, ...rest } = props
  const [localType, setLocalType] = useState(type)

  return (
    <Container
      width={width}
      className={`${className}`}>
      <Wrapper $invalid={error}>
        <CustomInput
          {...rest}
          ref={ref}
          placeholder={label || 'Text...'}
          type={localType}
          width={type === 'password' ? 'calc(100% - 30px)' : '100%'}
        />
        {label && <Label $invalid={error}>{label}</Label>}
        {error && $showError && <Error>{error}</Error>}
        {type === 'password' && (
          <PasswordIcon
            src={localType === 'password' ? hidePassword : showPassword}
            onClick={() => (localType === 'password' ? setLocalType('text') : setLocalType(type))}
            alt='password'
          />
        )}
      </Wrapper>
    </Container>
  )
})

export type TextFormFieldProps = {
  name: string
  form?: any
} & InputProps

const TextFormField = (props: TextFormFieldProps) => {
  const { form } = props

  if (form) {
    return <TextFormFieldWithForm {...props} />
  }
  return <TextFormFieldWithoutForm {...props} />
}

const TextFormFieldWithoutForm = (props: TextFormFieldProps) => {
  const { name, ...rest } = props
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <Input
      error={errors?.[name]?.message}
      {...rest}
      {...register(name)}
    />
  )
}

const TextFormFieldWithForm = (props: TextFormFieldProps) => {
  const { name, form, ...rest } = props
  const {
    register,
    formState: { errors },
  } = form
  return (
    <Input
      error={errors?.[name]?.message}
      {...rest}
      {...register(name)}
    />
  )
}

export default TextFormField

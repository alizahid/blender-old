import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useCallback } from 'react'

import {
  IAuthResult,
  IMutationSignInArgs,
  IMutationVerifyOtpArgs
} from '../graphql/types'
import { dialog } from '../lib'
import { useAuth } from '../store'

const SIGN_IN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      ...authResultFields
      __typename
    }
  }

  fragment authResultFields on AuthResult {
    idToken
    user {
      ...userFields
      __typename
    }
    __typename
  }

  fragment userFields on User {
    id
    active
    canBill
    createdAt
    email
    featureFlags
    githubId
    gitlabId
    name
    notifyOnFail
    notifyOnPrUpdate
    otpEnabled
    passwordExists
    __typename
  }
`

export const useSignIn = () => {
  const [, { login }] = useAuth()

  const { loading: verifying, verify } = useVerifyOtp()

  const [mutate, { loading }] = useMutation<
    {
      signIn: IAuthResult
    },
    IMutationSignInArgs
  >(SIGN_IN)

  const signIn = useCallback(
    (email: string, password: string) =>
      mutate({
        async update(proxy, response) {
          if (!response.data) {
            return
          }

          const { idToken, user } = response.data.signIn

          if (idToken && user) {
            await login(idToken, user.id, user.email)
          } else if (user?.otpEnabled) {
            const code = await dialog.prompt({
              keyboardType: 'number-pad',
              message: 'Enter your 6-digit two-factor code',
              placeholder: 'Code',
              title: 'Two-factor auth'
            })

            if (!code) {
              return
            }

            verify(user.id, code)
          }
        },
        variables: {
          email,
          password
        }
      }),
    [login, mutate, verify]
  )

  return {
    loading: loading || verifying,
    signIn
  }
}

const VERIFY_OTP = gql`
  mutation verifyOTP($userId: String!, $code: String!) {
    verifyOTP(userId: $userId, code: $code) {
      ...authResultFields
      __typename
    }
  }

  fragment authResultFields on AuthResult {
    idToken
    user {
      ...userFields
      __typename
    }
    __typename
  }

  fragment userFields on User {
    id
    active
    canBill
    createdAt
    email
    featureFlags
    githubId
    gitlabId
    name
    notifyOnFail
    notifyOnPrUpdate
    otpEnabled
    passwordExists
    __typename
  }
`

export const useVerifyOtp = () => {
  const [, { login }] = useAuth()

  const [mutate, { loading }] = useMutation<
    {
      verifyOTP: IAuthResult
    },
    IMutationVerifyOtpArgs
  >(VERIFY_OTP)

  const verify = useCallback(
    (userId: string, code: string) =>
      mutate({
        async update(proxy, response) {
          if (!response.data) {
            return
          }

          const { idToken, user } = response.data.verifyOTP

          if (idToken && user) {
            await login(idToken, user.id, user.email)
          }
        },
        variables: {
          code,
          userId
        }
      }),
    [login, mutate]
  )

  return {
    loading,
    verify
  }
}

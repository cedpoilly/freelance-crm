import { readonly, ref } from "vue"

import constants from "../constants/constants.json"

import useAlert from '../app/alert'

const { alert } = useAlert()

const loading = ref(false)
const isLoading = readonly(loading)

// * Consumed and updated globally 
const routingDirection = ref("")

const setScrollSmooth = ref(false)

export default function useGlobalState() {
  return {
    isLoading, asyncLoadingWrap,
    routingDirection,
    setScrollSmooth,
  }
}

/**
 * Updates the `isLoading` state to `true` before the function's execution and
 * reverts it to `false` once done.
 * The `isLoading` state is used universally in this app. It allows the 
 * UI to update its state when an async operation is in progress.
 * @param {Function} fn The aynsc function to execute
 * @param  {...any} args The arguments to be passed to the function
 * @returns {any} Returns the response from the method execution if any.
 */
async function asyncLoadingWrap(fn, ...args) {
  startLoadingState()

  let response
  let error

  try {
    response = await fn(...args)

  } catch (caughtError) {
    error = true
    const title = constants.alert.warning.title
    const text = "Something went wrong: \n" + caughtError.message
    await alert({ title, text })

  } finally { stopLoadingState() }

  return { response, error }
}

function startLoadingState() { loading.value = true }

function stopLoadingState() { loading.value = false }

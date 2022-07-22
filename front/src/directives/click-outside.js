export default ['click-outside', {
  beforeMount(el, binding) {
    document.body.addEventListener("click", clickOutsideEventCallBack)

    el.clickOutsideEventCallBack = clickOutsideEventCallBack

    function clickOutsideEventCallBack(event) {
      const isSelf = el === event.target
      const isParent = el.contains(event.target)
      if (isSelf || isParent) {
        return
      }

      binding.value(event, el)
    }
  },

  unmounted({ clickOutsideEventCallBack }) {
    document.body.removeEventListener("click", clickOutsideEventCallBack)
  },
}]
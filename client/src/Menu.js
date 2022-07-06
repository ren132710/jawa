//delegate menu item events to Menu
export default class Menu {
  constructor(elem) {
    this.elem = elem
    //bind the elem's onclick event to the class onClick method
    elem.onclick = this.onClick.bind(this) // (*)
  }

  #setUnits(system) {
    console.log('calling setUnits with: ', system)
  }

  #setTheme(theme) {
    console.log('calling setThem with: ', theme)
  }

  onClick(event) {
    const action = event.target.dataset.action
    if (action == null) return
    if (action === 'imperial' || action === 'metric') {
      this.#setUnits(action)
    } else {
      this.#setTheme(action)
    }
  }
}

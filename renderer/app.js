
// Modules
const {ipcRenderer} = require('electron')
const items = require('./items.js')
const menu = require('./menu.js')

// Navigate selected item with up/down keys
$(document).keydown((e) => {

  switch (e.key) {
    case 'ArrowUp':
      items.changeItem('up')
      break;
    case 'ArrowDown':
      items.changeItem('down')
      break;
  }
})

// Show add-modal
$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active')
})
// Hide add-modal
$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active')
})

// Handle add-modal submission
$('#add-button').click(() => {

  // Get URL from input
  let newItemURL = $('#item-input').val()
  if(newItemURL) {

    // Disable modal UI
    $('#item-input').prop('disabled', true)
    $('#add-button').addClass('is-loading')
    $('.close-add-modal').addClass('is-disabled')

    // Send URL to main process via IPC
    ipcRenderer.send('new-item', newItemURL)
  }
})

// Listen for new item from main
ipcRenderer.on('new-item-success', (e, item) => {

  // Add item to items array
  items.toreadItems.push(item)

  // Save items
  items.saveItems()

  // Add item
  items.addItem(item)

  // Close and reset modal
  $('#add-modal').removeClass('is-active')
  $('#item-input').prop('disabled', false).val('')
  $('#add-button').removeClass('is-loading')
  $('.close-add-modal').removeClass('is-disabled')

  // If first item being added, select it
  if(items.toreadItems.length === 1)
    $('.read-item:first()').addClass('is-active')
})

// Simulate add click on enter
$('#item-input').keyup((e) => {
  if(e.key === 'Enter') $('#add-button').click()
})

// Filter items by title
$('#search').keyup((e) => {

  // Get current #search input value
  let filter = $(e.currentTarget).val()

  $('.read-item').each((i, el) => {
    $(el).text().toLowerCase().includes(filter) ? $(el).show(): $(el).hide()
  })
})

// Add items when app loads
if(items.toreadItems.length) {
  items.toreadItems.forEach(items.addItem)
  $('.read-item:first()').addClass('is-active')
}

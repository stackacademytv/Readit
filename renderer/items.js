
// Track items with array
exports.toreadItems = JSON.parse(localStorage.getItem('toreadItems')) || []

// Save items to localstorage
exports.saveItems = () => {
  localStorage.setItem('toreadItems', JSON.stringify(this.toreadItems))
}

// Toggle item as selected
exports.selectItem = (e) => {
  $('.read-item').removeClass('is-active')
  $(e.currentTarget).addClass('is-active')
}

// Select next/prev item
exports.changeItem = (direction) => {

  // Get current active item
  let activeItem = $('.read-item.is-active')

  // Check direction and get next or previous read-item
  let newItem = (direction === 'down') ? activeItem.next('.read-item') : activeItem.prev('.read-item')

  // Only if item exists, make selection change
  if(newItem.length) {
    activeItem.removeClass('is-active')
    newItem.addClass('is-active')
  }
}


// Window function
// Delete item by index
window.deleteItem = (i = false) => {

  // Set i to active item if not passed as argument
  if (i === false) i = ($('.read-item.is-active').index() - 1)

  // Remove item from DOM
  $('.read-item').eq(i).remove()

  // Remove from toreadItems array
  this.toreadItems = this.toreadItems.filter((item, index) => {
    return index !== i
  })

  // Update storage
  this.saveItems()

  // Select prev item or none if list empty
  if (this.toreadItems.length) {

    // If first item was deleted, select new first item in list, else previous item
    let newIndex = (i === 0) ? 0 : i - 1

    // Assign active class to new index
    $('.read-item').eq(newIndex).addClass('is-active')

  // Else show 'no items' message
  } else {
    $('#no-items').show()
  }
}

// Open item in default browser
window.openInBrowser = () => {

  // Only if items exists
  if ( !this.toreadItems.length ) return

  // Get selected item
  let targetItem = $('.read-item.is-active')

  // Open in Browser
  require('electron').shell.openExternal(targetItem.data('url'))
}


// Open item for reading
window.openItem = () => {

  // Only if items have been added
  if( !this.toreadItems.length ) return

  // Get selected item
  let targetItem = $('.read-item.is-active')

  // Get item's content url (encoded)
  let contentURL = encodeURIComponent(targetItem.data('url'))

  // Get item index to pass to proxy window
  let itemIndex = targetItem.index() - 1

  // Reader window URL
  let readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`

  // Open item in new proxy BrowserWindow
  let readerWin = window.open(readerWinURL, targetItem.data('title'))
}

// Add new item
exports.addItem = (item) => {

  // Hide 'no items' message
  $('#no-items').hide()

  // New item html
  let itemHTML = `<a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
                    <figure class="image has-shadow is-64x64 thumb">
                      <img src="${item.screenshot}">
                    </figure>
                    <h2 class="title is-4 column">${item.title}</h2>
                  </a>`
  // Apppend to read-list
  $('#read-list').append(itemHTML)

  // Attach select event handler
  $('.read-item')
    .off('click, dblclick')
    .on('click', this.selectItem)
    .on('dblclick', window.openItem)
}

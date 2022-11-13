const editor = ace.edit('editor', {
  mode: 'ace/mode/json',
  selectionStyle: 'text',
  showPrintMargin: false,
  theme: 'ace/theme/chrome'
})

const formatText = (spacing = 0) => {
  try {
    returnOriginalValue()
    if (editor.getValue() !== '') {
      const current = JSON.parse(editor.getValue())
      editor.setValue(JSON.stringify(current, null, spacing))
      editor.focus()
      editor.selectAll()
      if (spacing !== 0) validState()
    } else {
      alert('I think you are not clear about your goals. So, I am out.')
    }
  } catch (err) {
    error()
  }
}

editor.on('paste', (event) => {
  try {
    returnOriginalValue()
    event.text = JSON.stringify(JSON.parse(event.text), null, 4)
    validState()
  } catch (err) {
    error()
  }
})

const clearText = () => {
  try {
    returnOriginalValue()
    editor.setValue(null)
  } catch (err) {
    //
  }
}

const validState = () => {
  var x = document.getElementById("valid-state");
  x.style.display = "block";
}

const error = () => {
  var x = document.getElementById("error");
  x.style.display = "block";
}

const returnOriginalValue = () => {
  document.getElementById("error").style.display = "none";
  document.getElementById("valid-state").style.display = "none"
}

document.getElementById('minify').addEventListener('click', () => formatText())
document.getElementById('beautify').addEventListener('click', () => formatText(4))
document.getElementById('clear').addEventListener('click', () => clearText())
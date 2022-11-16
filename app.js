const editor = ace.edit("editor", {
    mode: "ace/mode/json",
    selectionStyle: "text",
    showPrintMargin: !1,
    theme: "ace/theme/chrome",
    highlightActiveLine: false,
    cursorStyle: 'slim',
    highlightGutterLine: false,
    fontSize: 14
}),
    formatText = (e = 0) => {
        try {
            var t;
            returnOriginalValue(), "" !== editor.getValue() ? (t = JSON.parse(editor.getValue()), editor.setValue(JSON.stringify(t, null, e)), editor.focus(), editor.selectAll(), 0 !== e && validState()) : alert("I think you are not clear about your goals.")
        } catch (e) {
            error()
        }
    };
editor.focus();
editor.on("paste", e => {
    try {
        returnOriginalValue(), e.text = JSON.stringify(JSON.parse(e.text), null, 4), validState()
    } catch (e) {
        error()
    }
});
const clearText = () => {
    try {
        returnOriginalValue(), editor.setValue(null), editor.focus()
    } catch (e) { }
},
    validState = () => {
        document.getElementById("valid-state").style.display = "block"
    },
    error = () => {
        document.getElementById("error").style.display = "block"
    },
    changeThemeToDark = () => {
        editor.setOptions({
            theme: 'ace/theme/tomorrow_night'
        })
    },
    returnOriginalValue = () => {
        document.getElementById("error").style.display = "none", document.getElementById("valid-state").style.display = "none"
    };
document.getElementById("minify").addEventListener("click", () => formatText()),
    document.getElementById("beautify").addEventListener("click", () => formatText(4)),
    document.getElementById("clear").addEventListener("click", () => clearText());
class FixedSizeQueue {
    constructor() {
        this.maxSize = 100;
        this.items = [];
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const savedQueue = localStorage.getItem('myQueue');
        this.items = savedQueue ? JSON.parse(savedQueue) : [];
        this.setDeleteHistoryButton();
    }

    enqueue(item) {
        const currentSize = this.size();
        if (this.items.length === 0 || (currentSize < this.maxSize && this.items[currentSize - 1].data !== item)) {
            const object = { data: item, currentTime: new Date() };
            this.items.push(object);
            this.saveToLocalStorage();
            this.setDeleteHistoryButton();
        } else if (currentSize === this.maxSize && this.items[currentSize - 1].data !== item) {
            this.dequeue();
            this.items.push(item);
            this.saveToLocalStorage();
        }
    }

    setDeleteHistoryButton() {
        const resetButton = document.getElementById('resetHistory');
        resetButton.disabled = this.items.length === 0;
    }

    saveToLocalStorage() {
        localStorage.setItem('myQueue', JSON.stringify(this.items.splice(0, 10)));
    }

    dequeue() {
        return this.isEmpty() ? null : this.items.shift();
    }

    showSelectedIndex(i) {
        return this.isEmpty() ? null : this.items[i];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

const myQueue = new FixedSizeQueue();
populateSidebar();

const editor = ace.edit("editor", {
    mode: "ace/mode/json",
    selectionStyle: "text",
    showPrintMargin: !1,
    theme: "ace/theme/chrome",
    highlightActiveLine: false,
    cursorStyle: 'slim',
    highlightGutterLine: false,
    fontSize: 14
});

function formatText(e = 0) {
    try {
        returnOriginalValue();
        const value = editor.getValue();
        if (value !== "") {
            const parsedValue = JSON.parse(value);
            myQueue.enqueue(JSON.stringify(parsedValue, null, e));
            populateSidebar();
            editor.setValue(JSON.stringify(parsedValue, null, e));
            editor.focus();
            editor.selectAll();
            if (e !== 0) validState();
        } else {
            alert("I think you are not clear about your goals.");
        }
    } catch (e) {
        error();
    }
}

editor.focus();
editor.on("paste", e => {
    try {
        returnOriginalValue();
        e.text = JSON.stringify(JSON.parse(e.text), null, 4);
        myQueue.enqueue(e.text);
        populateSidebar();
        validState();
    } catch (e) {
        error();
    }
});

function clearText() {
    try {
        returnOriginalValue();
        editor.setValue(null);
        editor.focus();
    } catch (e) {}
}

function validState() {
    document.getElementById("valid-state").style.display = "block";
}

function error() {
    document.getElementById("error").style.display = "block";
}

function changeThemeToDark() {
    document.documentElement.setAttribute("data-theme", "dark");
    editor.setOptions({
        theme: 'ace/theme/tomorrow_night'
    });
}

function resetLocalStorage() {
    localStorage.removeItem('myQueue');
    myQueue.loadFromLocalStorage();
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    setNoHistoryMessage();
    closeHistoryPanel();
}

function returnOriginalValue() {
    document.getElementById("error").style.display = "none";
    document.getElementById("valid-state").style.display = "none";
}

document.getElementById("minify").addEventListener("click", () => formatText());
document.getElementById("beautify").addEventListener("click", () => formatText(4));
document.getElementById("clear").addEventListener("click", clearText);
document.getElementById("resetHistory").addEventListener("click", resetLocalStorage);

window.addEventListener("beforeunload", function (e) {
    const confirmationMessage = "\o/";
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
});

function populateSidebar() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    const savedQueue = localStorage.getItem('myQueue');
    const queueToShow = savedQueue ? JSON.parse(savedQueue) : [];

    if (queueToShow.length === 0) {
        setNoHistoryMessage();
    } else {
        for (const item of queueToShow) {
            const historyItem = document.createElement("li");
            historyItem.textContent = item.data;
            historyItem.classList.add("history-item");
            historyList.appendChild(historyItem);

            const dateItem = document.createElement("li");
            const constant = 'Saved Time';
            const formattedDate = new Date(item.currentTime).toLocaleString();
            dateItem.textContent = `${constant} - ${formattedDate}`;
            dateItem.classList.add("history-date");
            historyList.appendChild(dateItem);

            historyItem.addEventListener("click", () => handleClick(item));
        }
    }
}

function setNoHistoryMessage() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    const noHistoryMessage = document.createElement("li");
    noHistoryMessage.textContent = "No history records found.";
    noHistoryMessage.classList.add("no-history-message");
    historyList.appendChild(noHistoryMessage);
}

function handleClick(item) {
    editor.setValue(JSON.stringify(JSON.parse(item.data)));
    formatText(4);
    validState();
    closeHistoryPanel();
}

function openHistoryPanel() {
    const historyPanel = document.getElementById("historyPanel");
    historyPanel.style.width = "350px";
    historyPanel.classList.add("show");
    document.getElementById("closeBtn").style.display = 'block';
}

function closeHistoryPanel() {
    const historyPanel = document.getElementById("historyPanel");
    historyPanel.style.width = "0";
    historyPanel.classList.remove("show");
    document.getElementById("closeBtn").style.display = 'none';
}

function toggleHistoryPanel(event) {
    const historyPanel = document.getElementById("historyPanel");

    if (historyPanel.classList.contains("show")) {
        closeHistoryPanel();
    } else {
        openHistoryPanel();
    }

    event.stopPropagation();
}

const historyButton = document.getElementById("history");
historyButton.addEventListener("click", toggleHistoryPanel);

const closeButton = document.getElementById("closeBtn");
closeButton.addEventListener("click", closeHistoryPanel);

document.addEventListener("click", function (event) {
    const historyPanel = document.getElementById("historyPanel");

    if (!historyPanel.contains(event.target) && historyPanel.classList.contains("show")) {
        closeHistoryPanel();
    }
});

window.onbeforeunload = function (e) {
    const message = "Are you sure ?";
    const firefox = /Firefox[\/\s](\d+)/.test(navigator.userAgent);
    if (firefox) {
        const dialog = document.createElement("div");
        document.body.appendChild(dialog);
        dialog.id = "dialog";
        dialog.style.visibility = "hidden";
        dialog.innerHTML = message;
        const left = document.body.clientWidth / 2 - dialog.clientWidth / 2;
        dialog.style.left = left + "px";
        dialog.style.visibility = "visible";
        const shadow = document.createElement("div");
        document.body.appendChild(shadow);
        shadow.id = "shadow";
        setTimeout(function () {
            document.body.removeChild(document.getElementById("dialog"));
            document.body.removeChild(document.getElementById("shadow"));
        }, 0);
    }
    return message;
};

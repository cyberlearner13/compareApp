const debounce = (fn, delay = 1000) => {
    let timerId;
    return (...args) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => fn.apply(null, args), delay);
    }
};
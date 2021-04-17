const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input type="text" class='input'>
        <div class = "dropdown">
          <div class="dropdown-menu">
              <div class="dropdown-content results">
              </div>
          </div>
      </div>
     
      <div id='target'>

      </div>`;

    // Look inside the root element
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');


    const onInput = async e => {
        const items = await fetchData(e.target.value);
        if (!items) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');

        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);

            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item); // A getter function ... kind of
                onOptionSelect(item); // This was a coupling fix...app specific
            });

            resultsWrapper.appendChild(option);
        }
    }

    input.addEventListener('change', debounce(onInput, 500));

    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });

}
<script>
    import zxcvbn from 'zxcvbn';
  
    let password = '';
    let length = 8;
    let specialCharacters = true;
    let caseSensitive = true;
    let includeAlphabets = true;
    let includeNumbers = true;
    let includeSpecialCharacters = true;
    let strengthResult;

    let selectedOptions = ["alphabets", "numbers", "specialCharacters"];
  
    function generatePassword() {
      let options = {
        length,
        specialCharacters,
        caseSensitive,
        includeAlphabets,
        includeNumbers,
        includeSpecialCharacters
      };
  
      password = generateCharacterSet(options);
      strengthResult = zxcvbn(password);
    }
  
    function generateCharacterSet(options) {
      let length = options.length || 8;
      let specialCharacters = selectedOptions.includes('specialCharacters') || false;
      let caseSensitive = selectedOptions.includes('caseSensitive') || false;
      let includeAlphabets = selectedOptions.includes('alphabets') || false;
      let includeNumbers = selectedOptions.includes('numbers') || false
      let includeSpecialCharacters = selectedOptions.includes('specialCharacters') || false;
  
      let password = '';
      let characters = '';
  
      if (includeAlphabets) {
        if (caseSensitive) {
          characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        } else {
          characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
      }
  
      if (includeNumbers) {
        characters += '0123456789';        
      }
  
      if (includeSpecialCharacters) {
        characters += '!@#$%^&*()';        
      }
  
      for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      return password;
    }

    function copyToClipboard() {
      navigator.clipboard.writeText(password);
    }
</script>
  
<style>
.form-control {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.form-control__label {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
}

.form-control__input {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
}

.form-control__checkbox {
    display: inline-block;
    margin-right: 10px;
}

.form-control__checkbox-label {
    font-size: 14px;
}

.strength-indicator {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.strength-indicator__bar {
    height: 10px;
    width: 100%;
    background-color: #ddd;
    border-radius: 5px;
    overflow: hidden;
}

.strength-indicator__bar--weak {
    background-color: #ff6666;
}

.strength-indicator__bar--fair {
    background-color: #ffb366;
}

.strength-indicator__bar--strong {
    background-color: #66cc66;
}

.strength-indicator__text {
    margin-left: 10px;
}
</style>

<h1>Password Generator</h1>

<div class="form-control">
    <label class="form-control__label" for="length">Length:</label>
    <input
        class="form-control__input"
        type="number"
        id="length"
        bind:value={length}
        on:input={event => length = +event.target.value}
        min="1"
        max="100"
    />
    <input
    class="form-control__input"
    type="range"
    id="length"
    bind:value={length}
    on:input={event => length = +event.target.value}
    min="1"
    max="100"
    />
</div>

<div class="form-control">
    <label class="form-control__label" for="case-sensitive">Case sensitivity:</label>
    <label class="form-control__checkbox">
        <input type="checkbox" id="case-sensitive" bind:checked={caseSensitive} />
        <span class="form-control__checkbox-label">Make password case sensitive</span>
    </label>
</div>

<div class="form-control">
    <label class="form-control__label" for="characters">Characters:</label>
    <label class="form-control__checkbox">
        <input type="checkbox" id="characters" bind:group={selectedOptions} value="alphabets" />
        <span class="form-control__checkbox-label">Include alphabets</span>
    </label>
    <label class="form-control__checkbox">
        <input type="checkbox" bind:group={selectedOptions} value="numbers" />
        <span class="form-control__checkbox-label">Include numbers</span>
    </label>
    <label class="form-control__checkbox">
        <input type="checkbox" bind:group={selectedOptions} value="specialCharacters" />
        <span class="form-control__checkbox-label">Include special characters</span>
    </label>
</div>

<button on:click={generatePassword}>Generate password</button>

{#if password}
  <div class="password-display">
    <div class="form-control">
      <label class="form-control__label" for="password">Password:</label>
      <input class="form-control__input" type="text" id="password" value={password} readonly />
      <button on:click={copyToClipboard}>Copy to clipboard</button>
    </div>

    <div class="strength-indicator">
      <div
        class="strength-indicator__bar"
        class:strength-indicator__bar--weak={strengthResult.score === 0}
        class:strength-indicator__bar--fair={strengthResult.score === 1}
        class:strength-indicator__bar--strong={strengthResult.score >= 2}
        style={{width: `${(strengthResult.score / 4) * 100}%`}}
      ></div>
      <div class="strength-indicator__text">
        {#if strengthResult.score === 0}
          Weak
        {/if}
        {#if strengthResult.score === 1}
          Fair
        {/if}
        {#if strengthResult.score >= 2}
          Strong
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if selectedOptions.length === 0 }
  <p>Please select atleast one character set</p>
{/if}
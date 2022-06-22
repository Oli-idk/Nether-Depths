// elements for obtaining vals
const nickName = document.getElementById('nickname');
const coloredNick = document.getElementById('coloredNick');
const outputText = document.getElementById('outputText');

const boldElement = document.getElementById('bold')
const italicElement = document.getElementById('italics')
const underlineElement = document.getElementById('underline')
const strikeElement = document.getElementById('strike')

const savedColors = ['00FFE0', 'EB00FF', getRandomHexColor(), getRandomHexColor(), getRandomHexColor(), getRandomHexColor(), getRandomHexColor(), getRandomHexColor(), getRandomHexColor(), getRandomHexColor()];
const toggled = false;
const presets = {
  0: {
    colors: ["00FFE0", "EB00FF"],
    text: "SimplyMC"
  },
  1: {
    colors: ["FF0000", "FF7F00", "FFFF00", "00FF00", "0000FF", "4B0082", "9400D3"],
    text: "Rainbow"
  },
  2: {
    colors: ["1488CC", "2B32B2"],
    text: "Skyline"
  },
  3: {
    colors: ["FFE259", "FFA751"],
    text: "Mango"
  },
  4: {
    colors: ["3494E6", "EC6EAD"],
    text: "Vice City"
  },
  5: {
    colors: ["F3904F", "3B4371"],
    text: "Dawn"
  },
  6: {
    colors: ["F4C4F3", "FC67FA"],
    text: "Rose"
  },
  7: {
    colors: ["CB2D3E", "EF473A"],
    text: "Firewatch"
  }
}
const formats = {
  0: {
    outputPrefix: '',
    template: '&#$1$2$3$4$5$6$f$c',
    formatChar: '&',
    maxLength: 256
  },
  1: {
    outputPrefix: '/nick ',
    template: '&#$1$2$3$4$5$6$f$c',
    formatChar: '&',
    maxLength: 256
  },
};

/* Get a random HEX color */
function getRandomHexColor() {
     return Math.floor(Math.random()*16777215).toString(16).toUpperCase();
}

const errorElement = document.getElementById('error')
function showError(show) {
  if (show) {
    errorElement.style.display = 'block';
    outputText.style.height = '70px';
    outputText.style.marginBottom = '5px';
  } else {
    errorElement.style.display = 'none';
    outputText.style.height = '95px';
    outputText.style.marginBottom = '10px';
  }
}

function hex(c) {
  let s = '0123456789abcdef';
  let i = parseInt(c);
  if (i == 0 || isNaN(c))
    return '00';
  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex(rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim(s) {
  return (s.charAt(0) == '#') ? s.substring(1, 7) : s
}

/* Convert a hex string to an RGB triplet */
function convertToRGB(hex) {
  let color = [];
  color[0] = parseInt((trim(hex)).substring(0, 2), 16);
  color[1] = parseInt((trim(hex)).substring(2, 4), 16);
  color[2] = parseInt((trim(hex)).substring(4, 6), 16);
  return color;
}

/**
 * JavaScript implementation of HexUtils Gradients from RoseGarden.
 * https://github.com/Rosewood-Development/RoseGarden/blob/master/src/main/java/dev/rosewood/rosegarden/utils/HexUtils.java#L358
 */
class Gradient {
  constructor(colors, numSteps) {
    this.colors = colors;
    this.gradients = [];
    this.steps = numSteps - 1;
    this.step = 0;

    const increment = this.steps / (colors.length - 1);
    for (let i = 0; i < colors.length - 1; i++)
      this.gradients.push(new TwoStopGradient(colors[i], colors[i + 1], increment * i, increment * (i + 1)));
  }

  /* Gets the next color in the gradient sequence as an array of 3 numbers: [r, g, b] */
  next() {
    if (this.steps <= 1)
      return this.colors[0];

    const adjustedStep = Math.round(Math.abs(((2 * Math.asin(Math.sin(this.step * (Math.PI / (2 * this.steps))))) / Math.PI) * this.steps));
    let color;
    if (this.gradients.length < 2) {
      color = this.gradients[0].colorAt(adjustedStep);
    } else {
      const segment = this.steps / this.gradients.length;
      const index = Math.min(Math.floor(adjustedStep / segment), this.gradients.length - 1);
      color = this.gradients[index].colorAt(adjustedStep);
    }

    this.step++;
    return color;
  }
}

class TwoStopGradient {
  constructor(startColor, endColor, lowerRange, upperRange) {
    this.startColor = startColor;
    this.endColor = endColor;
    this.lowerRange = lowerRange;
    this.upperRange = upperRange;
  }

  colorAt(step) {
    return [
      this.calculateHexPiece(step, this.startColor[0], this.endColor[0]),
      this.calculateHexPiece(step, this.startColor[1], this.endColor[1]),
      this.calculateHexPiece(step, this.startColor[2], this.endColor[2])
    ];
  }

  calculateHexPiece(step, channelStart, channelEnd) {
    const range = this.upperRange - this.lowerRange;
    const interval = (channelEnd - channelStart) / range;
    return Math.round(interval * (step - this.lowerRange) + channelStart);
  }
}

/* Toggles the number of gradient colors between 2 and 10 based on user input */
function toggleColors(colors) {
  let clamped = Math.min(10, Math.max(2, colors));
  if (colors == 1 || colors == '') {
    colors = getColors().length;
  } else if (colors != clamped) {
    $('#numOfColors').val(clamped);
    colors = clamped;
  }
  const container = $('#hexColors');
  const hexColors = container.find('.hexColor');
  const number = hexColors.length;
  if (number > colors) {
    // Need to remove some colors
    hexColors.each((index, element) => {
      if (index + 1 > colors) {
        savedColors[index] = $(element).val();
        $(element).parent().remove();
      }
    });
  } else if (number < colors) {
    // Need to add some colors
    let template = $('#hexColorTemplate').html();
    for (let i = number + 1; i <= colors; i++) {
      let html = template.replace(/\$NUM/g, i).replace(/\$VAL/g, savedColors[i - 1]);
      container.append(html);
    }
    jscolor.install(); // Refresh all jscolor elements
  }
}

/* Gets all colored entered by the user */
function getColors() {
  const hexColors = $('#hexColors').find('.hexColor');
  const colors = [];
  hexColors.each((index, element) => {
    const value = $(element).val();
    savedColors[index] = value;
    colors[index] = convertToRGB(value);
  });
  return colors;
}

const outputFormat = document.getElementById('output-format');
const formatSelector = document.getElementById('formatSelector');
function updateOutputText(event) {
  let format = formats[outputFormat.value];

  if (format.outputPrefix) {
    nickName.value = nickName.value.replace(/ /g, '');
    if (nickName.value) {
      let letters = /^[0-9a-zA-Z_]+$/;
      if (!nickName.value.match(letters)) nickName.value = nickName.value.replace(event.data, '');
      if (!nickName.value.match(letters)) nickName.value = 'SimplyMC';
    }
  }

  let newNick = nickName.value
  if (!newNick) {
    newNick = 'Type something!'
  }

  const bold = boldElement.checked;
  const italic = italicElement.checked;
  const underline = underlineElement.checked;
  const strike = strikeElement.checked;

  let gradient = new Gradient(getColors(), newNick.replace(/ /g, '').length);
  let charColors = [];
  let output = format.outputPrefix || "";
  for (let i = 0; i < newNick.length; i++) {
    let char = newNick.charAt(i);
    if (char == ' ') {
      output += char;
      charColors.push(null);
      continue;
    }

    let hex = convertToHex(gradient.next());
    charColors.push(hex);
    let hexOutput = format.template;
    for (let n = 1; n <= 6; n++)
      hexOutput = hexOutput.replace(`$${n}`, hex.charAt(n - 1));
    let formatCodes = '';
    if (format.formatChar) {
      formatSelector.classList.remove('hidden');

      if (bold) formatCodes += format.formatChar + 'l';
      if (italic) formatCodes += format.formatChar + 'o';
      if (underline) formatCodes += format.formatChar + 'n';
      if (strike) formatCodes += format.formatChar + 'm';
    } else {
      formatSelector.classList.add('hidden');
    }

    hexOutput = hexOutput.replace('$f', formatCodes);

    hexOutput = hexOutput.replace('$c', char);
    output += hexOutput;
  }

  outputText.innerText = output;
  showError(format.maxLength && format.maxLength < output.length);
  displayColoredName(newNick, charColors, format.formatChar);
}

/**
 * padding function:
 * cba to roll my own, thanks Pointy!
 * ==================================
 * source: http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
 */
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function displayColoredName(nickName, colors, format) {
  coloredNick.classList.remove('minecraftbold', 'minecraftibold', 'minecraftitalic');

  if (format) {
    if (boldElement.checked) {
      if (italicElement.checked) {
        coloredNick.classList.add('minecraftibold');
      } else {
        coloredNick.classList.add('minecraftbold');
      }
    } else if (italicElement.checked) {
      coloredNick.classList.add('minecraftitalic');
    }
  }

  coloredNick.innerHTML = '';
  for (let i = 0; i < nickName.length; i++) {
    const coloredNickSpan = document.createElement('span');
    if (underlineElement.checked) {
      if (strikeElement.checked) {
        coloredNickSpan.classList.add('minecraftustrike');
      } else coloredNickSpan.classList.add('minecraftunderline');
    } else if (strikeElement.checked) {
      coloredNickSpan.classList.add('minecraftstrike');
    }
    coloredNickSpan.style.color = `#${colors[i]}`;
    coloredNickSpan.textContent = nickName[i];
    coloredNick.append(coloredNickSpan);
  }
}

const numOfColors = document.getElementById("numOfColors")
function preset(n) {
  const colors = presets[n].colors
  const container = $('#hexColors');
  container.empty();
    // Need to add some colors
    let template = $('#hexColorTemplate').html();
    for (let i = 0 + 1; i <= colors.length; i++) {
      let html = template.replace(/\$NUM/g, i).replace(/\$VAL/g, colors[i - 1]);
      container.append(html);
    }
    nickName.value = presets[n].text
    numOfColors.value = colors.length
    jscolor.install(); // Refresh all jscolor elements
}

//todo
const presetSeparator = ":-:"
function exportPreset() {
  const hexColors = $('#hexColors').find('.hexColor');
  const colors = [];
  const bold = boldElement.checked;
  const italic = italicElement.checked;
  const underline = underlineElement.checked;
  const strike = strikeElement.checked;
  let selectedFormats = [bold, italic, underline, strike];
  compress(selectedFormats);
  hexColors.each((index, element) => {
    const value = $(element).val();
    savedColors[index] = value;
    colors[index] = value;
  });

  let string = colors + presetSeparator +
      nickName.value + presetSeparator +
      compress(selectedFormats) + presetSeparator +
      outputFormat.value

  let preset = toBinary(string);
  return preset;
}

function importPreset(p) {
  let preset = fromBinary(p)
  preset = preset.split(presetSeparator)
  let colors = preset[0].split(",")
  let nickname = preset[1]
  let formats = decompress(preset[2], 4)
  let selectedOutputFormat = preset[3]

  if (selectedOutputFormat) {
    outputFormat.value = selectedOutputFormat
  }

  boldElement.checked = formats[0];
  italicElement.checked = formats[1];
  underlineElement.checked = formats[2];
  strikeElement.checked = formats[3];

  const container = $('#hexColors');
  container.empty();
    // Need to add some colors
    let template = $('#hexColorTemplate').html();
    for (let i = 0 + 1; i <= colors.length; i++) {
      let html = template.replace(/\$NUM/g, i).replace(/\$VAL/g, colors[i - 1]);
      container.append(html);
    }
    nickName.value = nickname
    numOfColors.value = colors.length
    jscolor.install(); // Refresh all jscolor elements
    try {
      updateOutputText()
    } catch (error) {
      alert("Invalid Preset")
    }
}

function showfield(field){
  targetDiv = document.getElementById(field)
  if (targetDiv.style.display !== "none") {
    targetDiv.style.display = "none";
  } else {
    targetDiv.style.display = "block";
  }
}

// Takes an array of boolean values and turns them into a number
function compress(values) {
  let output = 0;
  for (let i = 0; i < values.length; i++) {
      const value = values[i];
      output |= ~~value << i;
  }
  return output;
}

// Takes a number and turns it into an array of boolean values
// Second parameter is how many values to parse out of the number
function decompress(input, expectedValues) {
  const values = [];
  for (let i = 0; i < expectedValues; i++) {
      const value = !!((input >> i) & 1);
      values.push(value);
  }
  return values;
}

// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte
function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

function fromBinary(encoded) {
  binary = atob(encoded)
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

toggleColors(2);
updateOutputText();

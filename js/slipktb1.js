function loadFonts() {
    const fonts = [
        new FontFace('DXKrungthaiThin', 'url(assets/fonts/DX-Krungthai-Thin.woff)'),
        new FontFace('DXKrungthaiRegular', 'url(assets/fonts/DX-Krungthai-Regular.woff)'),
        new FontFace('DXKrungthaiMedium', 'url(assets/fonts/DX-Krungthai-Medium.woff)'),
        new FontFace('DXKrungthaiSemiBold', 'url(assets/fonts/DX-Krungthai-SemiBold.woff)'),
        new FontFace('SFThonburiBold', 'url(assets/fonts/SFThonburi-Bold.woff)')
    ];

    return Promise.all(fonts.map(font => font.load())).then(function(loadedFonts) {
        loadedFonts.forEach(function(font) {
            document.fonts.add(font);
        });
    });
}

window.onload = function() {
    setCurrentDateTime();
    updateMonthAndYear(); 

    loadFonts().then(function() {
        document.fonts.ready.then(function() {
            updateDisplay(); 
        });
    }).catch(function() {
        updateDisplay();
    });
};

function setCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; 
    document.getElementById('datetime').value = formattedDate;

    const oneMinuteLater = new Date(now.getTime() + 60000); 
    const hours = oneMinuteLater.getHours().toString().padStart(2, '0');
    const minutes = oneMinuteLater.getMinutes().toString().padStart(2, '0');
    const formattedTimePlusOne = `${hours}:${minutes}`;
    document.getElementById('datetime_plus_one').value = formattedTimePlusOne;
}

function padZero(number) {
    return number < 10 ? '0' + number : number;
}

function updateMonthAndYear() {
    const today = new Date();
    const shortThaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const shortMonth = shortThaiMonths[today.getMonth()]; 
    const year = today.getFullYear() + 543; 
    const monthAndYear = `${shortMonth} ${year % 100}`; 
    document.getElementById('monthandyear').value = monthAndYear;
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    let formattedDate = new Date(date).toLocaleDateString('th-TH', options);
    formattedDate = formattedDate.replace(/ /g, ' ').replace(/\./g, '');
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const day = padZero(formattedDate.split(' ')[0]);
    const month = months[new Date(date).getMonth()];
    const year = formattedDate.split(' ')[2];
    return `${day} ${month} ${year}`;
}

let qrCodeImage = null;
let powerSavingMode = false;

function handlePaste(event) {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    qrCodeImage = img;
                    updateDisplay();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(blob);
        }
    }
}

window.updateDisplay = function() {
    const monthandyear = document.getElementById('monthandyear').value || '-';
    const datetime = document.getElementById('datetime').value || '-';
    const datetimePlusOne = document.getElementById('datetime_plus_one').value || '-';

    const batteryLevel = document.getElementById('battery').value || '100';
    const sendername = document.getElementById('sendername').value || '-';
    const senderaccount = document.getElementById('senderaccount').value || '-';

    const formattedDate = formatDate(datetime.substring(0, 10)); 
    const formattedTime = datetime.substring(11, 16); 
    const formattedTimePlusOne = datetimePlusOne; 

    const money01 = document.getElementById('money01').value || '-';
    
    const choose1 = document.getElementById('choose1').value || '-';
    let money1 = document.getElementById('money1').value || '-';
    const time1 = document.getElementById('time1').value || '-';
    
    const choose2 = document.getElementById('choose2').value || '-';
    let money2 = document.getElementById('money2').value || '-';
    const time2 = document.getElementById('time2').value || '-';
    
    const choose3 = document.getElementById('choose3').value || '-';
    let money3 = document.getElementById('money3').value || '-';
    const time3 = document.getElementById('time3').value || '-';
    
    if (choose1 === 'โอนเงินออก' && !money1.startsWith('-')) {
        if (money1.startsWith('+')) {
            money1 = '-' + money1.substring(1);
        } else {
            money1 = '-' + money1;
        }
    } else if (choose1 === 'เงินโอนเข้า' && !money1.startsWith('+')) {
        if (money1.startsWith('-')) {
            money1 = '+' + money1.substring(1);
        } else {
            money1 = '+' + money1;
        }
    }

    document.getElementById('money1').value = money1;
    
    if (choose2 === 'โอนเงินออก' && !money2.startsWith('-')) {
        if (money2.startsWith('+')) {
            money2 = '-' + money2.substring(1);
        } else {
            money2 = '-' + money2;
        }
    } else if (choose2 === 'เงินโอนเข้า' && !money2.startsWith('+')) {
        if (money2.startsWith('-')) {
            money2 = '+' + money2.substring(1);
        } else {
            money2 = '+' + money2;
        }
    }

    document.getElementById('money2').value = money2;
    
    if (choose3 === 'โอนเงินออก' && !money3.startsWith('-')) {
        if (money3.startsWith('+')) {
            money3 = '-' + money3.substring(1);
        } else {
            money3 = '-' + money3;
        }
    } else if (choose3 === 'เงินโอนเข้า' && !money3.startsWith('+')) {
        if (money3.startsWith('-')) {
            money3 = '+' + money3.substring(1);
        } else {
            money3 = '+' + money3;
        }
    }

    document.getElementById('money3').value = money3;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const backgroundImage = new Image();
    backgroundImage.src = 'assets/image/bs/backgroundEnter-KT11.jpg';
    backgroundImage.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        drawText(ctx, `${formattedTimePlusOne}`, 27.4, 23.2, 18.50, 'SFThonburiBold', '#4a4c4b','left', 1.5, 3, 0, 0, 800, 0);
        
        let textColor1 = '#63bb07';
        if (choose1 === 'โอนเงินออก') {
            textColor1 = '#da0000';
        }
        
        let textColor2 = '#63bb07';
        if (choose2 === 'โอนเงินออก') {
            textColor2 = '#da0000';
        }
        
        let textColor3 = '#63bb07';
        if (choose3 === 'โอนเงินออก') {
            textColor3 = '#da0000';
        }
        
        drawText(ctx, `${monthandyear}`, 45.4, 648.5,24.5, 'DXKrungthaiSemiBold', '#0098d2', 'right', 1.5, 3, 0, 0, 400, 0);

        drawText(ctx, `${sendername}`, 41.9, 171.4,25.49, 'DXKrungthaiSemiBold', '#ffffff','left', 1.5, 3, 0, 0, 800, 0);
        drawText(ctx, `${senderaccount}`, 41.9, 208.0,22.49, 'DXKrungthaiThin', '#d1f5fe', 'left', 1.5, 3, 0, 0, 800, 1);
        drawText(ctx, `${money01}`, 41.9, 295.5,40.49, 'DXKrungthaiSemiBold', '#ffffff','left', 1.5, 3, 0, 0, 800, -0.25);
        drawText(ctx, `${money01}`, 36.4, 337.1,23.24, 'DXKrungthaiRegular', '#ffffff','right', 1.5, 3, 0, 0, 800, -0.50);
        
        drawText(ctx, `${choose1}`, 43.3, 723.0,25.58, 'DXKrungthaiMedium', '#000000','left', 1.5, 3, 0, 0, 800, 0);
        drawText(ctx, `${money1}`, 36.4, 762.2,25.58, 'DXKrungthaiSemiBold', textColor1,'right', 1.5, 3, 0, 0, 800, -0.50);
        drawText(ctx, `${formattedDate} - ${time1}`, 36.4, 720.5,22.49, 'DXKrungthaiRegular', '#8a9ba7', 'right', 1.5, 3, 0, 0, 400, 0.50);

        drawText(ctx, `${choose2}`, 43.3, 853.8,25.58, 'DXKrungthaiMedium', '#000000','left', 1.5, 3, 0, 0, 800, 0);
        drawText(ctx, `${money2}`, 36.4, 893.5,25.58, 'DXKrungthaiSemiBold', textColor2,'right', 1.5, 3, 0, 0, 800, -0.50);
        drawText(ctx, `${formattedDate} - ${time2}`, 36.4, 851.6,22.49, 'DXKrungthaiRegular', '#8a9ba7', 'right', 1.5, 3, 0, 0, 400, 0.50);

        drawText(ctx, `${choose3}`, 43.3, 985.4,25.58, 'DXKrungthaiMedium', '#000000','left', 1.5, 3, 0, 0, 800, 0);
        drawText(ctx, `${money3}`, 36.4, 1024.8,25.58, 'DXKrungthaiSemiBold', textColor3,'right', 1.5, 3, 0, 0, 800, -0.50);
        drawText(ctx, `${formattedDate} - ${time3}`, 36.4, 982.6,22.49, 'DXKrungthaiRegular', '#8a9ba7', 'right', 1.5, 3, 0, 0, 400, 0.50);

        if (qrCodeImage) {
            ctx.drawImage(qrCodeImage, 0, 130.3, 555, 951);
        }

        drawBattery(ctx, batteryLevel, powerSavingMode);
    };
}

function drawText(ctx, text, x, y, fontSize, fontFamily, color, align, lineHeight, maxLines, shadowColor, shadowBlur, maxWidth, letterSpacing) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.shadowColor = shadowColor || 'transparent';
    ctx.shadowBlur = shadowBlur || 0;

    const paragraphs = text.split('<br>');
    let currentY = y;

    paragraphs.forEach(paragraph => {
        const words = paragraph.split(' ');
        let currentLine = '';
        const lines = [];

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width + (testLine.length - 1) * letterSpacing;

            if (testWidth > maxWidth && i > 0) {
                lines.push(currentLine);
                currentLine = words[i] + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);

        lines.forEach((line, index) => {
            let currentX = x;
            if (align === 'center') {
                currentX = (ctx.canvas.width - ctx.measureText(line).width) / 1.72 - ((line.length - 1) * letterSpacing) / 2;
            } else if (align === 'right') {
                currentX = ctx.canvas.width - x - ctx.measureText(line).width - ((line.length - 1) * letterSpacing);
            }

            drawTextLine(ctx, line.trim(), currentX, currentY, letterSpacing);
            currentY += lineHeight;
            if (maxLines && index >= maxLines - 1) {
                return;
            }
        });
    });
}

function drawTextLine(ctx, text, x, y, letterSpacing) {
    if (!letterSpacing) {
        ctx.fillText(text, x, y);
        return;
    }

    const characters = text.split('');
    let currentPosition = x;

    characters.forEach((char, index) => {
        const charCode = char.charCodeAt(0);
        const prevChar = index > 0 ? characters[index - 1] : null;

        const isUpperVowel = (charCode >= 0x0E34 && charCode <= 0x0E37);
        const isToneMark = (charCode >= 0x0E48 && charCode <= 0x0E4C);
        const isBeforeVowel = (charCode === 0x0E31);
        const isBelowVowel = (charCode >= 0x0E38 && charCode <= 0x0E3A);

        let yOffset = 0;
        let xOffset = 0;

        if (isUpperVowel) {
            yOffset = -1;
            xOffset = 0;
        }

        if (isToneMark) {
            if (prevChar && ((prevChar.charCodeAt(0) >= 0x0E34 && prevChar.charCodeAt(0) <= 0x0E37) || prevChar.charCodeAt(0) === 0x0E31)) {
                yOffset = -8; 
                xOffset = 0; 
            } else {
                yOffset = 0; 
                xOffset = -7; 
            }
        }

        if (isBeforeVowel) {
            yOffset = -1;
            xOffset = 1;
        }

        if (isBelowVowel) {
            yOffset = 0;
            xOffset = -10;
        }

        ctx.fillText(char, currentPosition + xOffset, y + yOffset);

        if (!isToneMark && !isBeforeVowel && !isBelowVowel) {
            currentPosition += ctx.measureText(char).width + letterSpacing;
        } else {
            currentPosition += ctx.measureText(char).width;
        }
    });
}

function drawBattery(ctx, batteryLevel, powerSavingMode) {
    ctx.lineWidth = 2; 
    ctx.strokeStyle = '#f9fafc'; 
    ctx.fillStyle = '#f9fafc'; 

    let batteryColor = '#f9fafc'; 
    if (batteryLevel <= 20) {
        batteryColor = '#ff0000'; 
    } else if (powerSavingMode) {
        batteryColor = '#fccd0e'; 
    }

    const fillWidth = (batteryLevel / 100) * 35.5; 
    const x = 478.0;
    const y = 27.5;
    const height = 18.7;
    const radius = 6; 

    ctx.fillStyle = batteryColor; 

    ctx.beginPath(); 
    ctx.moveTo(x, y + radius); 
    ctx.lineTo(x, y + height - radius); 
    ctx.arcTo(x, y + height, x + radius, y + height, radius); 
    ctx.lineTo(x + fillWidth - radius, y + height); 
    ctx.arcTo(x + fillWidth, y + height, x + fillWidth, y + height - radius, radius); 
    ctx.lineTo(x + fillWidth, y + radius); 
    ctx.arcTo(x + fillWidth, y, x + fillWidth - radius, y, radius); 
    ctx.lineTo(x + radius, y); 
    ctx.arcTo(x, y, x, y + radius, radius); 
    ctx.closePath(); 
    ctx.fill(); 

    ctx.font = '800 17px SFThonburiBold';
    ctx.fillStyle = '#f9fafc';
    ctx.textAlign = 'center';
    ctx.fillText(`${batteryLevel}`, x + 35.5 / 2, y + height / 1.25);
}

window.togglePowerSavingMode = function() {
    powerSavingMode = !powerSavingMode;
    const powerSavingButton = document.getElementById('powerSavingMode');
    if(powerSavingButton) powerSavingButton.classList.toggle('active', powerSavingMode);
    updateDisplay();
}

window.updateBatteryDisplay = function() {
    const batteryLevel = document.getElementById('battery')?.value || '100';
    const bl = document.getElementById('battery-level');
    if (bl) bl.innerText = batteryLevel;
}

window.downloadImage = function() {
    const canvas = document.getElementById('canvas');
    if(!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'slip_ktb1.png';
    link.click();
}

document.getElementById('generate')?.addEventListener('click', updateDisplay);

function drawImage(ctx, imageUrl, x, y, width, height) {
    const image = new Image();
    image.src = imageUrl;
    image.onload = function() {
        ctx.drawImage(image, x, y, width, height);
    };
}
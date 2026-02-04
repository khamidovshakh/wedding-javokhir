const endpoint =
    'https://script.google.com/macros/s/AKfycbzxWTPoLFnskd7awtoKz2jJrxptfA9LztqV6dTdxw4DtAei6WifHgkc9UwBQTzz4simHg/exec'

const form = document.querySelector('form')

form.onsubmit = async e => {
    e.preventDefault()

    const btn = form.querySelector('button')
    if (btn) btn.disabled = true

    // соберём параметры формы
    const fd = new FormData(form)
    const qs = new URLSearchParams()
    fd.forEach((v, k) => qs.append(k, v || '-'))

    try {
        const res = await fetch(`${endpoint}?${qs.toString()}`, {
            method: 'GET'
        })
        // если CORS ок — сюда дойдём и сможем прочитать ответ
        const text = (await res.text()).trim()
        if (text.toUpperCase() === 'OK' || text === 'ОК') {
            window.location.href = '/thanks.html'
            return
        }
        console.warn('Unexpected response:', text)
        if (btn) btn.disabled = false
        return
    } catch (err) {
        // 2) Fallback: no-cors (ответ не читаем, просто уходим на thanks)
        try {
            await fetch(`${endpoint}?${qs.toString()}`, {
                method: 'GET',
                mode: 'no-cors'
            })
            window.location.href = '/thanks.html'
            return
        } catch (e2) {
            console.error('Failed to submit:', e2)
            if (btn) btn.disabled = false
        }
    }
}

// Задаем конечную дату и время
const targetDate = new Date('February 14, 2026 18:00:00').getTime()

function updateTimer() {
    // Текущее время
    const now = new Date().getTime()

    // Разница между текущим временем и целевой датой
    const timeLeft = targetDate - now

    // Вычисляем дни, часы, минуты и секунды
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    // Обновляем содержимое элементов
    document.getElementById('days').innerText = days
    document.getElementById('hours').innerText = hours
    document.getElementById('minutes').innerText = minutes
    document.getElementById('seconds').innerText = seconds

    // Если время истекло, остановить таймер
    if (timeLeft < 0) {
        clearInterval(timerInterval)
        document.getElementById('timer').innerHTML = 'Время вышло!'
    }
}

// Обновляем таймер каждую секунду
const timerInterval = setInterval(updateTimer, 1000)

// Изначально обновляем таймер, чтобы сразу увидеть значение
updateTimer()

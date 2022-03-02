const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Robin'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Robin'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'help message',
        title: 'Help',
        name: 'Robin'
    })
})

// weather
app.get('/weather', (req, res)=> {
    if (!req.query.adress) {
        return res.send({
            error: 'You must provide an adress!'
        })
    }

    geocode(req.query.adress, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                location: location,
                forecast: forecastData,
                adress: req.query.adress
            })
        })
    })
})

// test
app.get('/products', (req, res)=> {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

// 404s
app.get('/help/*', (req, res) => {
    res.render('404page', {
        errorMsg: 'Help article not found.',
        name: 'Robin',
        title: '404'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        errorMsg: 'Page not found.',
        name: 'Robin',
        title: '404'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
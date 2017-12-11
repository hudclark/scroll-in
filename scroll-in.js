(function ($) {

    let scrollInterval = null

    $.fn.scrollIn = function (options) {
        options = options || {}
        const percentageVisible = ('percentageVisible' in options) ? options.percentageVisible : (1/7)
        const durationFactor = ('durationFactor' in options) ? options.durationFactor : 1
        const delayFactor = ('delayFactor' in options) ? options.delayFactor : 1
        const movementFactor = ('movementFactor' in options) ? options.movementFactor : 1

        const $window = $(window)
        const windowHeight = $window.height()


        const removeElement = (element) => {
            const index = elements.indexOf(element)
            if (index > -1) {
                elements.splice(index, 1)
            }
        }

        const getAnimationCss = (element, start, duration) => {
            let movementAmount = element.attr('movementAmount') || '40px'
            if (movementFactor !== 1) {
                const amount = (movementAmount.match(/\d+/)[0] * movementFactor).toString()
                movementAmount = amount + movementAmount.substr(amount.length)
            }
            const animation = element.attr('animation')
            const transitionValue = (start) ?  movementAmount: 0
            let transform = null
            if (animation === 'slide-right') {
                transform = `translateX(-${transitionValue})`
            } else if (animation === 'slide-left') {
                transform = `translateX(${transitionValue})`
            } else {
                transform = `translateY(${transitionValue})`
            } 
            return {
                opacity: (start ? 0 : 1),
                transform,
                transition: 'all ' + duration + 's'
            }
        }

        let didScroll = false
        $window.on('scroll.scrollIn', () => didScroll = true)

        let elements = this.toArray().map(e => $(e))
        elements.forEach(e => {
            e.css(getAnimationCss(e, true))
        })

        const animateElementsIn = () => {
            const visibleElements = elements.filter(e => {
                const offset = e.height() * percentageVisible
                const position = $window.scrollTop() - e.offset().top + windowHeight
                return (position >= offset)
            })
            visibleElements.forEach (e => {
                const delay = (e.attr('delay') || 0) * delayFactor
                const duration = (e.attr('duration') || .4) * durationFactor
                setTimeout(() => e.css(getAnimationCss(e, false, duration)), delay)
                removeElement(e)
            })
        }

        setInterval(() => {
            if (!didScroll) return
            didScroll = false
            animateElementsIn()
            if (elements.length === 0) {
                removeScrollListeners()
            }
        }, 100)

        // animate any current elements in
        animateElementsIn()

    }

    $.fn.stopScrollIn = function () {
        removeScrollListeners()
    }

    function removeScrollListeners () {
        $(window).off('scroll.scrollIn')
        clearInterval(scrollInterval)
    }


}(jQuery))
(function ($) {

    $.fn.scrollIn = function (options) {
        options = options || {}
        const percentageVisible = options.percentageVisible || (1/7)
        const $window = $(window)
        const windowHeight = $window.height()

        let didScroll = false
        $window.on('scroll.scrollIn', () => didScroll = true)

        let elements = this.toArray().map(e => $(e))
        elements.forEach(e => {
            e.css(getAnimationCss(e, true))
        })

        const removeElement = (element) => {
            const index = elements.indexOf(element)
            if (index > -1) {
                elements.splice(index, 1)
            }
        }

        const animateElementsIn = () => {
            const visibleElements = elements.filter(e => {
                const offset = e.height() * percentageVisible
                const position = $window.scrollTop() - e.offset().top + windowHeight
                return (position >= offset)
            })
            visibleElements.forEach (e => {
                const delay = e.attr('delay') || 0
                setTimeout(() => e.css(getAnimationCss(e)), delay)
                removeElement(e)
            })
        }

        const scrollInterval = setInterval(() => {
            if (!didScroll) return
            didScroll = false
            animateElementsIn()
            if (elements.length === 0) {
                $window.off('scroll.scrollIn')
                clearInterval(scrollInterval)
            }
        }, 100)

        // animate any current elements in
        animateElementsIn()

    }

    function getAnimationCss (element, start) {
        const movementAmount = element.attr('movementAmount') || '40px'
        const duration = element.attr('duration') || '0.4s'
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
            transition: 'all ' + duration
        }
    }

}(jQuery))
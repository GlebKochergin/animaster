addListeners();
let animations = {}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 2000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y:20}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animations['moveAndHide'] = animaster().moveAndHide(block);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animations['moveAndHide'].resetMoveAndHide(block);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animations['heartBeating'] = animaster().heartBeating(block, 1000, 1.4);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animations['heartBeating'].stop();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    return {
        _steps: [],

        play: function(element) {
            for (let step of this._steps) {
                step.action(element);
            }
            this._steps = [];
        },

        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        addMove: function (duration, translation) {
            this._steps.push({
                action: function (element) {
                    animaster().move(element, duration, translation);
                },
                duration: duration,
                translation: translation
            })

            return this;
        },

        fadeIn: function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },
        heartBeating: function (element, duration, ratio) {
            let beat = setInterval(() => {
                this.scale(element, duration / 2, ratio);
                setTimeout(this.scale, duration / 2, element, duration / 2, 1 / ratio)
            }, duration);

            return {
                stop: function () {
                    clearTimeout(beat);
                }
            }
        },

        scale: function (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide: function (element) {
            element.style.transitionDuration = `${1200}ms`;
            element.style.transform = getTransform({x: 100, y: 20}, null);
            element.style.transitionDuration = `${800}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return {
                resetMoveAndHide: function (element) {
                    element.style.animationDuration = null;
                    element.classList.remove('hide');
                    element.classList.add('show');
                    element.style.transform = null;
                }
            }
        },
        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },
        resetFadeIn: function (element) {
            element.style.animationDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut: function (element) {
            element.style.animationDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        }

    }
}
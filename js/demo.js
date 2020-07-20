/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
    const mapNumber = (X,A,B,C,D) => (X-A)*(D-C)/(B-A)+C;
    // from http://www.quirksmode.org/js/events_properties.html#position
	const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
		if (!e) e = window.event;
		if (e.pageX || e.pageY) {
            posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
        return { x : posx, y : posy }
    }
    // Generate a random float.
    const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

    /**
     * One class per effect. 
     * Lots of code is repeated, so that single effects can be easily used. 
     */

    // Effect 14
    class HoverImgFx14 {
        constructor(el) {
            this.DOM = {el: el};
            
            this.DOM.reveal = document.createElement('div');
            this.DOM.reveal.className = 'hover-reveal';
            let inner = '';
            const imgsArr = this.DOM.el.dataset.img.split(',');
            for (let i = 0, len = imgsArr.length; i <= len-1; ++i ) {
                inner += `<div class="hover-reveal__img" style="transform-origin:0% 0%;opacity:0;position:absolute;background-image:url(${imgsArr[i]})"></div>`;
            }
            this.DOM.reveal.innerHTML = inner;
            this.DOM.el.appendChild(this.DOM.reveal);
            this.DOM.revealImgs = [...this.DOM.reveal.querySelectorAll('.hover-reveal__img')];
            this.imgsTotal = this.DOM.revealImgs.length;

            this.initEvents();
        }
        initEvents() {
            this.positionElement = (ev) => {
                const mousePos = getMousePos(ev);
                const docScrolls = {
                    left : document.body.scrollLeft + document.documentElement.scrollLeft, 
                    top : document.body.scrollTop + document.documentElement.scrollTop
                };
                // this.DOM.reveal.style.top = `${mousePos.y-50%-docScrolls.top}px`;
                // this.DOM.reveal.style.left = `${mousePos.x+50%-docScrolls.left}px`;
            };
            this.mouseenterFn = (ev) => {
                this.positionElement(ev);
                this.showImage();
            };
            this.mousemoveFn = ev => requestAnimationFrame(() => {
                this.positionElement(ev);
            });
            this.mouseleaveFn = () => {
                this.hideImage();
            };
            
            this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
            this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        }
        showImage() {
            this.DOM.reveal.style.opacity = 1;
            TweenMax.set(this.DOM.el, {zIndex: 1000});
            TweenMax.set(this.DOM.revealImgs, {opacity: 0});

            const show = () => {
                TweenMax.killTweensOf(this.DOM.revealImgs[this.current]);
                TweenMax.set(this.DOM.revealImgs[this.current], {zIndex: 1000});
                TweenMax.to(this.DOM.revealImgs[this.current], 0.4, {
                    ease: Quint.easeOut,
                    startAt: {opacity: 0, scale: 0.5, rotation: -15, x: '0%', y: '-10%'},
                    opacity: 1,
                    y: '0%',
                    rotation: 0,
                    scale: 1
                });
            };
            this.current = 0;
            show();
            
            const loop = () => {
                this.imgtimeout = setTimeout(() => {
                    this.DOM.revealImgs[this.current].style.zIndex = '';
                    TweenMax.to(this.DOM.revealImgs[this.current], 0.8, {
                        ease: Expo.easeOut,
                        x: `${getRandomFloat(-10,10)}%`,
                        y: `${getRandomFloat(10,60)}%`,
                        rotation: getRandomFloat(5,15),
                        opacity: 0
                    });
                    this.current= this.current < this.imgsTotal-1 ? this.current+1 : 0;
                    show();
                    loop();
                }, 500);
            }
            loop();
        }
        hideImage() {
            clearTimeout(this.imgtimeout);
            this.DOM.revealImgs[this.current].style.zIndex = '';
            this.DOM.revealImgs[this.current].style.opacity = 0;
            this.current = 0;
            TweenMax.set(this.DOM.el, {zIndex: ''});
            TweenMax.set(this.DOM.reveal, {opacity: 0})
        }
    }
   
    [...document.querySelectorAll('[data-fx="14"] > a, a[data-fx="14"]')].forEach(link => new HoverImgFx14(link));

    // Demo purspose only: Preload all the images in the page..
    const contentel = document.querySelector('.content');
    [...document.querySelectorAll('.block__title, .block__link, .content__text-link')].forEach((el) => {
        const imgsArr = el.dataset.img.split(',');
        for (let i = 0, len = imgsArr.length; i <= len-1; ++i ) {
            const imgel = document.createElement('img');
            imgel.style.visibility = 'hidden';
            imgel.style.width = 0;
            imgel.src = imgsArr[i];
            imgel.className = 'preload';
            contentel.appendChild(imgel);
        }
    });
    imagesLoaded(document.querySelectorAll('.preload'), () => document.body.classList.remove('loading'));
}

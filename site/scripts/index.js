import parallax from './components/parallax';

window.addEventListener('DOMContentLoaded', function() {
    const parallaxElem = document.querySelector('#gaming .parallax');
    const imageList = [
            'parallax--dragon-skyline',
            'parallax--ravenloft',
            'parallax--saltmarsh',
            'parallax--tasha',
            'parallax--travelling'
        ];
    
    parallax.setBackground(parallaxElem, imageList);
});
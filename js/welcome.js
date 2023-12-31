document.addEventListener('DOMContentLoaded', () => {
    // Check if cookies are set
    if (!document.cookie.includes("welcomeShown=true")) {
      // Wrapper animation
      anime.timeline({
        targets: ".welcome",
        easing: "easeOutExpo",
      })
        .add({
          width: ["0vw", "100vw"],
          opacity: 1,
          duration: 1200,
        })
        .add({
          delay: 2700,
          translateX: "100vw",
          duration: 1500,
          complete: function (anime) {
            document.querySelector('.welcome').remove();
          }
        });
  
      // Text animation
      anime({
        targets: ".heading",
        delay: 400,
        opacity: 1,
        duration: 1800,
        translateY: ["-30px", "0px"],
        easing: "easeOutExpo",
      });
  
      // Text-sm animation
      anime({
        targets: ".sub-heading",
        delay: 600,
        opacity: 1,
        duration: 1800,
        translateY: ["-30px", "0px"],
        easing: "easeOutExpo",
      });
  
      // Loader animation
      anime({
        targets: ".loader",
        delay: 2000,
        duration: 2300,
        width: ["0", "100%"],
        easing: "easeOutExpo",
      });
  
      // Loader-wrapper animation
      anime({
        targets: ".loader-wrapper",
        delay: 1500,
        duration: 1800,
        opacity: 1,
        easing: "easeOutExpo",
      });
  
      // Set cookie to indicate welcome screen has been shown
      document.cookie = "welcomeShown=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }else{
            // Hide the welcome div
            document.querySelector('#welcomeScreen').style.display = "none";

    }
  });
  
 //Paragraphs
// 	anime({
// 		targets: 'p',
//   	opacity: 1,
//   	duration: 1800,
//   	translateY: ["-30px", "0px"],
//   	easing: "easeOutExpo",
// 		delay: (el, i) => 5200 + 100 * i,
// 	})

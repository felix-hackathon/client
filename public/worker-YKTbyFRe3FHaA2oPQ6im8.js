(()=>{"use strict";var e={r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}};e.r({}),self.addEventListener("message",(e=>{console.log(null==e?void 0:e.data)})),self.addEventListener("push",(e=>{const t=JSON.parse((null==e?void 0:e.data.text())||"{}");null==e||e.waitUntil(self.registration.showNotification("Notification",{body:t}))})),self.addEventListener("notificationclick",(e=>{null==e||e.notification.close(),null==e||e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:!0}).then((function(e){if(e.length>0){let t=e[0];for(let n=0;n<e.length;n++)e[n].focused&&(t=e[n]);return t.focus()}return self.clients.openWindow("/")})))}))})();
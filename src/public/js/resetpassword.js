const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit', e=>{
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value,key)=>obj[key]=value);

    fetch('/api/sessions/resetpassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(result=>{ 
        if(result.status === 200){
            window.location.replace('/signin')
        }
     })

})
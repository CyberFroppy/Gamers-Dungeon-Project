function verifyAdmin() {
    let token = localStorage.getItem('token');
    if (token) {
        let url = '/api/verify-admin';
        let settings = {
            method: 'GET',
            headers: {
                sessiontoken: token
            }
        };
        fetch(url, settings).then(response => {
            if (response.ok && response.status === 200) {
                let adminSection = document.querySelectorAll('.admin-section');
                adminSection.forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                throw new Error(response.statusText);
            }
        }).catch(err => {
            console.log(err);
            console.log("Not an admin");
        });
    }
}

export default verifyAdmin;

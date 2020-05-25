function verifyToken() {
    let token = localStorage.getItem('token');
    if (token) {
        let url = '/api/verify-token';
        let settings = {
            method: 'GET',
            headers: {
                sessiontoken: token
            }
        };
        fetch(url, settings).then(response => {
                if (response.ok && response.status == 200) {
                    console.log("Authenticated");
                } else {
                    throw new Error(response.statusText);
                }
            })
            .catch(_ => {
                console.log("Failed authentication");
                window.location.href = "index.html";
            });
    }
}

verifyToken();

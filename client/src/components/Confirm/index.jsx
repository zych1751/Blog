import React from 'react';
import axios from 'axios';

class Confirm extends React.Component {
    componentDidMount() {
        axios.post(API_SERVER_URL+'/api/account/confirm', {
            username: this.props.match.params.username,
            confirmCode: this.props.match.params.code
        }).then((res) => {
            // 메일 확인이 완료되었습니다. 다시 로그인 해주세요.
            alert("\uBA54\uC77C \uD655\uC778\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uB85C\uADF8\uC778 \uD574\uC8FC\uC138\uC694.");
            this.props.history.push('/login');
        }).catch((err) => {
            alert("error");
        });
    }

    render() {
        return (
            <div>
                confirm
            </div>
        );
    }
};

export default Confirm;;

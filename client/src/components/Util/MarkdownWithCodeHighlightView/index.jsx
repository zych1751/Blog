import React from "react";
import ReactMarkdown from "react-markdown";
import Loadable from "react-loadable";

const Code = (props) => {
    const loader = {
        Lowlight: () => (import("react-lowlight"))
    }

    // 현재 html태그 직접 삽입이 막혀있어 이 방식으로 youtube 영상 넣는걸 대체합니다.
    if(props.language == 'youtube') {
        return (<iframe width="640" height="360"
            src={props.value}
            frameBorder="0" allowFullScreen></iframe>);
    }

    if(props.language) {
        loader.lang = () => (import(`highlight.js/lib/languages/${props.language}`));
    }

    let Cmp = Loadable.Map({
        loader: loader,
        render: (loaded, _) => {
            let { lang, Lowlight } = loaded;
            if(lang) {
                Lowlight.registerLanguage(props.language, lang);
            }
            return <Lowlight language={props.language || ""} value={props.value || ""} />;
        },
        loading: () => {
            return (<pre><code>{props.value || ""}</code></pre>);
        }
    });

    return (<Cmp />);
};

const Img = (props) => {
    return (<img className="post-view-image" src={props.src} />);
};

const renderers = { code: Code, image: Img };

const MarkDown = (props) => {
    return (<ReactMarkdown {...props} renderers={renderers} />);
}

export default MarkDown;

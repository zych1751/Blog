import React from "react";
import ReactMarkdown from "react-markdown";
import Loadable from "react-loadable";

const Code = (props) => {
    const loader = {
        Lowlight: () => (System.import("react-lowlight"))
    }

    if(props.language) {
        loader.lang = () => (System.import(`highlight.js/lib/languages/${props.language}`));
    }

    console.log(props);
    let Cmp = Loadable.Map({
        loader: loader,
        render: (loaded, _) => {
            let { lang, Lowlight } = loaded;
            console.log(lang);
            Lowlight = Lowlight.default;
            if(lang) {
                lang = lang.default;
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

const renderers = { code: Code };

const MarkDown = (props) => {
    console.log("hihi");
    console.log(props);
    console.log("hihi");
    return (<ReactMarkdown {...props} renderers={renderers} />);
}

export default MarkDown;

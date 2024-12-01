//반응형을 디자인하기 위한 미디어쿼리 파일

import React from "react";
import { useMediaQuery } from "react-responsive"

type Props = {
    children: React.ReactNode
}

const Mobile = ({children}: Props) => {
    const isMobile = useMediaQuery({
        query : "(max-width:767px)"
    });

    return <React.Fragment>{isMobile && children}</React.Fragment>
}

const PC = ({children}: Props) => {
    const isPc = useMediaQuery({
        query : "(min-width:768px) "

    });

    return <React.Fragment>{isPc && children}</React.Fragment>
}

export default {Mobile, PC};

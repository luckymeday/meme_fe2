import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row } from "react-bootstrap";
import PaginationMeme from "../components/PaginationMeme";
import MemeList from "../components/MemeList";
import { memeActions } from "../redux/actions";
import ClipLoader from "react-spinners/ClipLoader";

const GalleryPage = () => {
    // const memes = [
    //     { id: "1" },
    //     { id: "2" },
    //     { id: "3" },
    //     { id: "4" },
    //     { id: "5" },
    //     { id: "6" },
    // ];

    const [pageNum, setPageNum] = useState(1);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.meme.loading);
    const totalPageNum = useSelector((state) => state.meme.totalPageNum);
    const memes = useSelector((state) => state.meme.memes);

    useEffect(() => {
        dispatch(memeActions.memesRequest(pageNum));
    }, [dispatch, pageNum]);

    const showDetail = () => {
        if (loading === true)
            return <ClipLoader color="#f86c6b" size={150} loading={loading} />
    }

    return (
        <Container className="p-2">
            <Row className="fill d-flex justify-content-center align-items-center">
                <PaginationMeme pageNum={pageNum}
                    setPageNum={setPageNum}
                    totalPageNum={totalPageNum}
                    loading={loading} />
                <MemeList memes={memes} showDetail={showDetail} />

            </Row>
        </Container>
    );
};

export default GalleryPage;
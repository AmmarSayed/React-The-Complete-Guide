import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { getAllComments } from "../../lib/api";
import LoadingSpinner from "../ui/LoadingSpinner";
import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import CommentsList from "./CommentsList";

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);

  const params = useParams();

  const { qid } = params;

  const { sendRequest, status, data: loadedComments } = useHttp(getAllComments);

  useEffect(() => {
    sendRequest(qid);
  }, [qid, sendRequest]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  const addCommentHandler = useCallback(() => {
    sendRequest(qid);
  }, [sendRequest, qid]);

  let comments;

  if (status === "pending") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && loadedComments && loadedComments.length > 0) {
    comments = <CommentsList comments={loadedComments} />;
  }

  if (
    status === "completed" &&
    (!loadedComments || loadedComments.length === 0)
  ) {
    comments = <p className="centered">No comments were added yet!</p>;
  }
  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm onAddedComment={addCommentHandler} quoteId={qid} />
      )}

      {comments}
    </section>
  );
};

export default Comments;

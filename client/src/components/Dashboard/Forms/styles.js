import styled from "styled-components";

export default styled.div`
  width: auto;
  margin: auto;
  max-width: 1920px;
  padding: 0rem 3em 2rem;

  #formManager {
    padding: 2rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }

  #formManager .sub-header {
    font-weight: 100;
  }

  #formManager svg {
    // color: initial;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
    transition: all .15s ease-in-out;
  }
  #formManager svg:hover {
    // background: #f1f1f1;
    box-shadow: 0 3px 6px #ddd;
  }


  .form-list {
    display: grid;
    grid-gap: 1rem;
    grid-auto-rows: 250px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .form-list-item {
    display: flex;
    flex-direction: column;


    padding: 1rem;
    cursor: pointer;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 3px 5px #ddd;
    border-bottom: 6px solid #f5812f;
    border: 1px solid rgb(221 221 221 / 50%);
    transition: .15s ease-in-out;
  }
  .form-list-item:hover {
    transform: scale(1.03);
    box-shadow: 0 7px 30px 10px #ddd;
    border-bottom: 6px solid #f5812f !important;
  }
  .form-list-item:hover .form-title label {
    color: #f5812f;
    transition: .15s ease-in-out;
  }

  .form-list-item .form-title {
    display: flex;
    align-items: center;
  }
  .form-list-item .form-title label {
    font-weight: 600;
    font-size: 20px;
    // color: #f5812f;
  }
  .form-list-item .form-title svg {
    position: relative;
    right: -12px;

    color: #2097f3;
    margin-left: auto;
  }

  .form-list-item .form-date span {
    color: gray;
    font-size: 14px;
  }

  .form-list-item .form-category {
    margin-top: auto;
    display: flex;
    align-items: center;
  }
  .form-list-item .form-category label {
    font-size: 14px;
    font-weight: bold;
  }
  .form-list-item .form-category .category-actions {
    position: relative;
    right: -12px;
    margin-left: auto;
  }
  .form-list-item .form-category .category-actions svg {
    color: gray;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
  }
  .form-list-item .form-category .category-actions svg:hover {
    background: rgb(239 239 239 / 55%);
    transition: all .25s ease-in-out
  }
  .form-list-item .form-category .category-actions svg.copy-icon:hover {
    color: #ffffff;
    background: #f5812f;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }
  .form-list-item .form-category .category-actions svg.delete-icon:hover {
    color: #ffffff;
    background: #f44336;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }





  // =================================
  // ********* MEDIA QUERIES *********
  // =================================
  
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
    
  }
  
`;
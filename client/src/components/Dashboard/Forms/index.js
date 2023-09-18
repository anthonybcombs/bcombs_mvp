import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import update from 'immutability-helper';
import cloneDeep from 'lodash.clonedeep';
import { parse } from "query-string";

import FormStyled from './styles';
import Loading from '../../../helpers/Loading.js';

import { requestVendor } from '../../../redux/actions/Vendors';
import {
	requestGetForms,
	requestUpdateForm,
	requestAddForm,
	requestDeleteForm,
} from '../../../redux/actions/FormBuilder';

import AdminFormStyled from '../Admin/form/index';

import Headers from './headers';
import List from './list';

export default props => {
	const {
		auth,
		vendors,
		loading,
   	 	vendor,
		form: { formList = [], updateForm, addForm, deleteForm },
	} = useSelector(({ auth, vendors, vendor, loading, form }) => {
		return { auth, vendors, vendor, loading, form };
	});
	const dispatch = useDispatch();
  const queryParams = parse(location.search);

	const [isLoading, setIsLoading] = useState(false);
	const [list, setList] = useState(formList);

	const [renameModal, setRenameModal] = useState(false);
	const [cloneModal, setCloneModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState();
  const [selectedForm, setSelectedForm] = useState();

	const GetRequestFormList = value => {
    console.log('queryParams?.vendor', queryParams?.vendor);
    
    if(queryParams?.vendor) {
      const selectedVendor = vendors.filter(i => queryParams.vendor == i.id2)[0];
      if(selectedVendor?.id) {
        const isOwner = !!(auth.user_id == selectedVendor.user_id);
        setSelectedVendor(selectedVendor)
        dispatch(requestGetForms({ vendor: selectedVendor?.id, currentUser: auth.user_id, isOwner, categories: value || [] }));
      } else {
        const isOwner = !!(auth.user_id == vendors[0].user_id);
        setSelectedVendor(vendors[0].id)
        dispatch(requestGetForms({ vendor: vendors[0].id, currentUser: auth.user_id, isOwner, categories: value || [] }));
      }
    } else {
      const isOwner = !!(auth.user_id == vendors[0].user_id);
      setSelectedVendor(vendors[0].id)
      dispatch(requestGetForms({ vendor: vendors[0].id, currentUser: auth.user_id, isOwner, categories: value || [] }));
    }
		setIsLoading(true);
	};

	useEffect(() => {
		if (auth.user_id) {
			dispatch(requestVendor(auth.user_id));
			setIsLoading(true);
		}
	}, []);

	useEffect(() => {
		if (vendors && vendors.length > 0) {
			GetRequestFormList();
		}
	}, [vendors]);

	useEffect(() => {
		if (isLoading && !loading.getForm) {
			setIsLoading(false);
		}
	}, [loading.getForm]);

	useEffect(() => {
		// if (formList.length) {
		setList(formList);
		// }
	}, [formList]);

	useEffect(() => {
		if (updateForm.form && Object.keys(updateForm.form).length && !loading.updateForm) {
			setList(
				update(list, {
					[list.findIndex(e => e.form_id === updateForm.form.form_id)]: { $merge: updateForm.form },
				})
			);
			setRenameModal(false);
		}
	}, [updateForm]);

	useEffect(() => {
		if (addForm && addForm.message == 'successfully created your application form') {
			GetRequestFormList();
			setCloneModal(false);

      setShowAdminForm(true);
      setSelectedForm(addForm.form);
		}
	}, [addForm]);

	useEffect(() => {
		if (deleteForm && deleteForm.message == 'successfully delete you application form') {
			GetRequestFormList();
			setDeleteModal(false);
		}
	}, [deleteForm]);

	const handleUpdateList = data => {
		dispatch(requestUpdateForm(data));
	};

	const handleCloneForm = data => {
		dispatch(requestAddForm(data));
		setIsLoading(true);
	};

	const handleDeleteForm = form_id => {
		dispatch(requestDeleteForm(form_id));
	};

	const handleChangeFilter = value => {
		GetRequestFormList(value);
	};

	// console.log('wewwwwwwwwwwww', { loading, list })

	return (
		<FormStyled>
			<h2>Form Manager</h2>
			<div id="formManager">
				<Headers vendor={queryParams?.vendor} onChangeFilter={handleChangeFilter} />
				{isLoading ? (
					<Loading />
				) : (
					<List
						list={list}
						loading={loading.updateForm || loading.addForm || loading.deleteForm}
						onUpdateList={handleUpdateList}
						onCloneForm={handleCloneForm}
						onDeleteForm={handleDeleteForm}
						//for modals
						renameModal={renameModal}
						cloneModal={cloneModal}
						deleteModal={deleteModal}
						setRenameModal={data => setRenameModal(data)}
						setCloneModal={data => setCloneModal(data)}
						setDeleteModal={data => setDeleteModal(data)}
						vendor={queryParams?.vendor}
					/>
				)}
			</div>
      {
        showAdminForm && (
          <AdminFormStyled
            selectedVendor={selectedVendor}
            selectedForm={selectedForm}
            newVendor={null}
            handleExit={() => {
              setShowAdminForm(false);
            }}
          />
        )
      }
		</FormStyled>
	);
};

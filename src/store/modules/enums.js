import dataDicApi from '../../api/dataDic'

const enums = {
  state: {
    departmentEnum: [],
    investmentEnum: [],
    researchEnum: [],
    subsidiaryEnum: [],
    participateEnum: [],
    relationTypeEnum: [],
    intoPointEnum: [],
    outPointEnum: [],
    endPointEnum: [],
    reportGradeEnum: [],
    ruleParamTypeEnum: [],
    businessSideEnum: [],
    assetBusinessTypeEnum: [],
    crossStatusEnum: []
  },
  mutations: {
    DEPARTMENT_ENUM: (state, dataEnum) => {
      state.departmentEnum = []
      dataEnum.forEach((item, index) => {
        state.departmentEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    INVESTMENT_ENUM: (state, dataEnum) => {
      state.investmentEnum = []
      dataEnum.forEach((item, index) => {
        state.investmentEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    RESEARCH_ENUM: (state, dataEnum) => {
      state.researchEnum = []
      dataEnum.forEach((item, index) => {
        state.researchEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    SUBSIDIARY_ENUM: (state, dataEnum) => {
      state.subsidiaryEnum = []
      dataEnum.forEach((item, index) => {
        state.subsidiaryEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    ASSET_BUSINESS_TYPE_ENUM: (state, dataEnum) => {
      state.assetBusinessTypeEnum = []
      dataEnum.forEach((item, index) => {
        state.assetBusinessTypeEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    PARTICIPATE_ENUM: (state, dataEnum) => {
      state.participateEnum = []
      dataEnum.forEach((item, index) => {
        state.participateEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    RELATION_TYPE_ENUM: (state, dataEnum) => {
      state.relationTypeEnum = []
      dataEnum.forEach((item, index) => {
        state.relationTypeEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    INTO_POINT_ENUM: (state, dataEnum) => {
      state.intoPointEnum = []
      dataEnum.forEach((item, index) => {
        state.intoPointEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    OUT_POINT_ENUM: (state, dataEnum) => {
      state.outPointEnum = []
      dataEnum.forEach((item, index) => {
        state.outPointEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    END_POINT_ENUM: (state, dataEnum) => {
      state.endPointEnum = []
      dataEnum.forEach((item, index) => {
        state.endPointEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    REPORT_GRADE_ENUM: (state, dataEnum) => {
      state.reportGradeEnum = []
      dataEnum.forEach((item, index) => {
        state.reportGradeEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    RULE_PARAM_TYPE_ENUM: (state, dataEnum) => {
      state.ruleParamTypeEnum = []
      dataEnum.forEach((item, index) => {
        state.ruleParamTypeEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    BUSINESS_SIDE_ENUM: (state, dataEnum) => {
      state.businessSideEnum = []
      dataEnum.forEach((item, index) => {
        state.businessSideEnum.push({
          label: item.value,
          value: item.value
        })
      })
    },
    CROSS_STATUS_ENUM: (state, dataEnum) => {
      state.crossStatusEnum = []
      dataEnum.forEach((item, index) => {
        state.crossStatusEnum.push({
          label: item.value,
          value: item.value
        })
      })
    }
  },
  actions: {
    departmentEnum: ({commit}) => {
      dataDicApi.getDic.r('department').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('DEPARTMENT_ENUM', dataEnum)
        }
      })
    },
    investmentEnum: ({commit}) => {
      dataDicApi.getDic.r('investment_business_type').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('INVESTMENT_ENUM', dataEnum)
        }
      })
    },
    researchEnum: ({commit}) => {
      dataDicApi.getDic.r('research_business_type').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('RESEARCH_ENUM', dataEnum)
        }
      })
    },
    subsidiaryEnum: ({commit}) => {
      dataDicApi.getDic.r('subsidiary_business_type').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('SUBSIDIARY_ENUM', dataEnum)
        }
      })
    },
    assetBusinessTypeEnum: ({commit}) => {
      dataDicApi.getDic.r('asset_business_type').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('ASSET_BUSINESS_TYPE_ENUM', dataEnum)
        }
      })
    },
    participateEnum: ({commit}) => {
      dataDicApi.getDic.r('participate_item_form').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('PARTICIPATE_ENUM', dataEnum)
        }
      })
    },
    relationTypeEnum: ({commit}) => {
      dataDicApi.getDic.r('related_type').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('RELATION_TYPE_ENUM', dataEnum)
        }
      })
    },
    intoPointEnum: ({commit}) => {
      dataDicApi.getDic.r('intoList_point').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('INTO_POINT_ENUM', dataEnum)
        }
      })
    },
    outPointEnum: ({commit}) => {
      dataDicApi.getDic.r('outList_point').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('OUT_POINT_ENUM', dataEnum)
        }
      })
    },
    endPointEnum: ({commit}) => {
      dataDicApi.getDic.r('end_point').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('END_POINT_ENUM', dataEnum)
        }
      })
    },
    reportGradeEnum: ({commit}) => {
      dataDicApi.getDic.r('report_rating').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('REPORT_GRADE_ENUM', dataEnum)
        }
      })
    },
    ruleParamTypeEnum: ({commit}) => {
      dataDicApi.getDic.r('rule_parameter').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('RULE_PARAM_TYPE_ENUM', dataEnum)
        }
      })
    },
    businessSideEnum: ({commit}) => {
      dataDicApi.getDic.r('business_side').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('BUSINESS_SIDE_ENUM', dataEnum)
        }
      })
    },
    crossStatusEnum: ({commit}) => {
      dataDicApi.getDic.r('cross_status').then((res) => {
        let dataEnum = res
        if (Array.isArray(dataEnum)) {
          commit('CROSS_STATUS_ENUM', dataEnum)
        }
      })
    }
  },
  getters: {
    departmentEnum: (state) => state.departmentEnum,
    investmentEnum: (state) => state.investmentEnum,
    researchEnum: (state) => state.researchEnum,
    subsidiaryEnum: (state) => state.subsidiaryEnum,
    assetBusinessTypeEnum: (state) => state.assetBusinessTypeEnum,
    participateEnum: (state) => state.participateEnum,
    relationTypeEnum: (state) => state.relationTypeEnum,
    intoPointEnum: (state) => state.intoPointEnum,
    outPointEnum: (state) => state.outPointEnum,
    endPointEnum: (state) => state.endPointEnum,
    reportGradeEnum: (state) => state.reportGradeEnum,
    ruleParamTypeEnum: (state) => state.ruleParamTypeEnum,
    businessSideEnum: (state) => state.businessSideEnum,
    crossStatusEnum: (state) => state.crossStatusEnum
  }
}

export default enums

const $document = $(document);

// 일 데이터
let workResultData = {
    // key: day

    // 'data': '22.01.01'
    // 'endTime': '18.5'
    // 1 : {
    //     'date': '',
    //     'endTime': '',
    // }
}

// 석식 데이터
const dinnerResultData = {
    // key: day

    // 'data': '22.01.01'
    // 'name': '마이쥬스'
}

// 템플릿에 데이터 넣기
const addHtmlByTemplate = (wrapperClass, templateClass, data) => {
    const $wrapper = $(wrapperClass);
    const $template = $(templateClass);

    let templateString = $template.text();
    $.each(data, (key, value) => {
        templateString = templateString.replaceAll(`{[${key}]}`, value);
    })
    
    $wrapper.append(templateString);
}

// 전체 HTML 템플릿에 tr 데이터 넣기 + txt넣기
const addTotalHtml = (totalWorkTime) => {
    $('.js__result-html').text('');
    const tableRowHtml = $('.js__result-table').html();
    
    addHtmlByTemplate('.js__result-html', '.js__template__total', 
    {
        'tableRow': tableRowHtml,
        'totalWorkTime': totalWorkTime,
    }
    );

    $('.js__total-result__html').text($('.js__result-html').html());
}

// 18.5 => 18:30
const numberToTime = (numberTime) => {

    // 소수점 아니면
    if (Math.ceil(numberTime) == numberTime) {
        return numberTime.toString() + ':00';
    }
    else {
        return Math.floor(numberTime).toString() + ':30';
    }

}

// 18:30 => 18.5
const timeToNumber = (time) => {
    const timeData = time.split(':');

    const hour = Number(timeData[0]);
    const minute = timeData[1];

    if (minute === '00') {
        return hour
    }
    else {
        return hour + 0.5;
    }
}

// 데이터 추가 버튼처리
const addData = () => {
    // 시간 정보 유효성 검사
    const validateEndTimeData = (time) => {
        let pattern = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
        // console.log(time);
        // console.log(pattern.test(time));
        return pattern.test(time);
    }

    // 날짜 정보 생성(쪼개기)
    const splitDate = (date) => {
        const resultDate = {
            'original': '',
            'year' : '',
            'month' : '',
            'day' : '',
            'total': '',
        }
    
        const YMD = date.split('-');
    
        resultDate['original'] = date;
        resultDate['year'] = YMD[0].slice(-2);
        resultDate['month'] = YMD[1];
        resultDate['day'] = YMD[2];
        resultDate['total'] = [resultDate['year'], resultDate['month'], resultDate['day']].join('.');
    
        return resultDate;
    }

    /*
    // WORK 데이터 템플릿 사용해서 HTML에 입력
    const addWorkDataToHtml = (workData) => {
        // 기존 일 정보 삭제
        $('.js__work-table__row').remove();

        // 순서
        let number = 0;
        $.each(workData, (day, data) => {
            number += 1;

            const templateData = {
                'workNumber': number,
                'workDate': data['date'],
                'workEndTime': numberToTime(data['endTime']),
            }

            addHtmlByTemplate('.js__work-table', '.js__template__work', templateData);
        });
    }
    */

    const addDinnerDataToHtml = (dinnerData) => {
        // 기존 석식 정보 삭제
        $('.js__dinner-table__row').remove();

        // 순서
        let number = 0;
        $.each(dinnerData, (day, data) => {
            number += 1;

            const templateData = {
                'dinnerNumber': number,
                'dinnerDate': data['date'],
                'dinnerName': data['name'],
            }

            addHtmlByTemplate('.js__dinner-table', '.js__template__dinner', templateData);
        });
    }

    /*
    // 일 추가
    $document.on('click', '.js__add-work', event => {
        if(!event.target) return;

        // 일 정보 form
        const $workForm = $('.js__work-form');

        const date = $workForm.find("input[name='work-date']").val();
        const time = Number($workForm.find("select[name='work-time']").val());

        // TODO: validation 따로 구분 필요
        if (!date) {
            alert('날짜를 선택해주세요.')
            return;
        }

        const totalDate = splitDate(date);

        // 새로 입력된 데이터
        const newResultData = {
            'date': totalDate['total'],
            'endTime': time
        }

        // 저장
        const day = Number(totalDate['day']);
        workResultData[day] = newResultData;

        // 템플릿 이용해 HTML에 데이터 추가
        addWorkDataToHtml(workResultData);
    });
    */

    $document.on('click', '.js__add-dinner', event => {
        if(!event.target) return;

        // 석식 정보 form
        const $workForm = $('.js__dinner-form');

        const date = $workForm.find("input[name='dinner-date']").val();
        const name = $workForm.find("input[name='dinner-name']").val();

        // TODO: validation 따로 구분 필요
        if (!date) {
            alert('날짜를 선택해주세요.')
            return;
        }

        const totalDate = splitDate(date);

        // 새로 입력된 저녁 데이터
        const newResultData = {
            'date': totalDate['total'],
            'name': name,
        }

        // 저장
        const day = Number(totalDate['day']);
        dinnerResultData[day] = newResultData;

        // 템플릿 이용해 HTML에 데이터 추가
        addDinnerDataToHtml(dinnerResultData);
    });


    // 엑셀파일 불러오기
    $document.on('change', '.js__work__excel', event => {

        const filterExcelData = data => {

            const dayTimeWorkData = {
                // key: 일

            }
    
            // 각 일 마지막 근무 시간
            const lastWorkTime = {};

            data.forEach(row => {

                const rawMonthDay = row['일자']; // "8.01(월)"
                const rawTime = row['시간']; // "09:30-12:30"
                const rawText = row['일정명']; // "[푸드케어] 정기식단 상세 MO (식단표 레이어)"
                
                lastWorkTime[rawMonthDay] = {
                    'rawTime': rawTime,
                    'rawText': rawText
                }

            })
            

            // 년,월,일,총 데이터
            // const dateObject = organizeDate(rawMonthDay);

            $.each(lastWorkTime, (rawDate, data) => {

                // 날짜 데이터 정리
                const year = $("select[name='year']").val();
                const dayMonth = rawDate.slice(0,-3).split('.')
                const month = dayMonth[0].padStart(2, '0');
                const day = dayMonth[1];

                const totalDate = [year, month, day].join('.');


                // 시간 데이터 정리
                // 18:00-19:00에서 19:00 추출
                const stringEndTime = data['rawTime'].split('-')[1];
                // 데이터가 시간이 아닌경우 예외처리
                if (!validateEndTimeData(stringEndTime)) return;

                // TODO: 임시 - 새벽 근무 처리
                if (stringEndTime == '23:59') {
                    alert(`${day}일 데이터 및 총합 시간 수정이 필요합니다!\n(새벽근무의 경우 계산을 못했습니다)\n`);
                }

                const endTime = timeToNumber(stringEndTime);

                dayTimeWorkData[Number(day)] = {
                    'totalDate': totalDate,
                    'year': year,
                    'month': month,
                    'day': day,
                    'text': data['rawText'],
                    'endTime': endTime,
                }


            });

            return dayTimeWorkData;
        }


        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const data = reader.result;
          const workBook = XLSX.read(data, { type: 'binary' });

          workBook.SheetNames.forEach(sheetName => {
            const row = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            workResultData = filterExcelData(row);
          })
        }

        reader.readAsBinaryString(file);
    });
}

// 데이터 종합 버튼 처리
const resultData = () => {
    const combinedData = {
        // key: day;
        
        // value
        // 'date': '',
        // 'startTime': '',
        // 'endTime': '',
        // 'workedTime': '',
        // 'dinner': ''
        // 'text'
    }

    const addCombinedDataToHtml = (resultData) => {
        // 기존 OT 정보 삭제
        $('.js__result-table').empty();

        // 순서
        let number = 0;

        // 총 근무시간
        let totalWorkTime = 0;
        $.each(resultData, (day, data) => {

            
            const workStartTime = data['startTime'];
            const workEndTime = data['endTime'];
            const workedTime = workEndTime - workStartTime;
            
            // OT가 아닌 경우 처리
            if (workedTime <= 0) return;
            

            number += 1;
            totalWorkTime += workedTime;

            const templateData = {
                'workNumber': number,
                'workDate': data['date'],
                'workStartTime': numberToTime(workStartTime),
                'workEndTime': numberToTime(workEndTime),
                'workedTime': workedTime,
                'dinner': data['dinner']? data['dinner'] : '',
                'workText': data['text'],
            }

            addHtmlByTemplate('.js__result-table', '.js__template__result', templateData);
        });

        // 전체 테이블 생성용 함수
        addTotalHtml(totalWorkTime);
    }

    $document.on('click', '.js__combine-data', event => {
        if (!event.target) return;

        // 출근 시간에 따른 야근 시작 시간
        // const workStartTime = Number($("input[name='start-time']:checked").val()); radio 사용
        const workStartTime = Number($("[name='start-time']").val());
        const year = $("select[name='year']").val();
        
        $.each(workResultData, (day, workData) => {
            const data = {
                'date': [year, workData['month'], workData['day']].join('.'),
                'startTime': workStartTime,
                'endTime': workData['endTime'],
                'text': workData['text'],
            }

            combinedData[day] = data;
        })
        
        $.each(dinnerResultData, (day, dinnerData) => {
            if (!combinedData[day] || (combinedData[day].date != dinnerResultData[day].date)) {
                alert(`${dinnerData['date']}에는 OT 일정이 없습니다! 한번 확인해주세요!`);
                return;
            }

            combinedData[day]['startTime'] = combinedData[day]['startTime'] + 1;
            combinedData[day]['dinner'] = `석식대<br/>(${dinnerData['name']})`;
        })

        console.log(combinedData);

        // 템플릿 이용해 HTML에 데이터 추가
        addCombinedDataToHtml(combinedData);

        $('.js__result__html').text($('.js__result-table').html());
    });
}

const copyTotalResultHtml = () => {
    $(document).on('click', '.js__copy', event => {
        const html = $('.js__total-result__html').text();
        window.navigator.clipboard.writeText(html);
        alert('HTML이 복사되었습니다! OT대장 HTML에 덮어주세요!');
    });

    $(document).on('click', '.js__copy-row', event => {
        const html = $('.js__result__html').text();
        window.navigator.clipboard.writeText(html);
        alert('<tr> HTML이 복사되었습니다!');
    });
}

const initEvent = () => {
    const $document = $(document);

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        };
    }, true);

    $document.on('change', '#csv-file', (event) => {
        const $input = $(event.target);
        const fileName = $input.val().split('\\').pop();
        $('#csv-file-label').text(fileName);
    });
}

// 엑셀파일 드래그 드롭 기능
const dragDropEvent = () => {
    const $window = $(window);
    const $input = $('.js__work__excel');
    const $label = $('.js__drag-drop');

    const toggleDragDropActive = (hasEntered) => {
        $label.toggleClass('itemdrop', hasEntered);
    }

    $window.on("dragover drop", event => {
        event.preventDefault();
    });

    $label
    .on('dragenter', event => {
        event.preventDefault();
        toggleDragDropActive(true);
    })
    .on('dragleave', event => {
        event.preventDefault();
        toggleDragDropActive(false);
    })
    .on('drop', event => {
        event.preventDefault();
        const file = event.originalEvent.dataTransfer && event.originalEvent.dataTransfer.files;

        toggleDragDropActive(false);
        $label.toggleClass('active', true);

        $input[0].files = file;
        $input.trigger('change');
    });
}

const overTimeInit = () => {
    addData();
    resultData();
    copyTotalResultHtml();

    initEvent();
    dragDropEvent();
    
}

overTimeInit();